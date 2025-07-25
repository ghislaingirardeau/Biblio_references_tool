<template>
  <div class="relative flex flex-wrap">
    <canvas
      ref="canvasRef"
      :width="canvasWidth"
      :height="canvasWHeight"
      style="border: 1px solid #ccc; touch-action: none"
      @mousedown="startDrag"
      @mousemove="onDrag"
      @mouseup="stopDrag"
      @mouseleave="stopDrag"
      @touchstart.prevent="startDrag"
      @touchmove.prevent="onDrag"
      @touchend.prevent="stopDrag"
    />
    <video ref="videoRef" style="display: none" autoplay playsinline />

    <q-btn @click="captureRect" color="primary" label="Scan" class="absolute bottom-7 right-7" />
    <q-btn
      flat
      color="primary"
      @click="modalReferenceStore.reset()"
      label="Close"
      class="absolute bottom-7 left-7"
    />
  </div>
</template>

<script setup lang="ts">
import { useDevicesList, useUserMedia } from '@vueuse/core';
import type { Quote } from 'src/types/books';
import { computed, onMounted, onUnmounted, reactive, ref, shallowRef, watchEffect } from 'vue';

import { useWindowSize } from '@vueuse/core';
import { useModalReferenceStore } from 'src/stores/modalReferences';
const { width, height } = useWindowSize();

const modalReferenceStore = useModalReferenceStore();

const newQuote = defineModel<Quote>('newQuote');
const emits = defineEmits(['next-step']);

const currentCamera = shallowRef<string>();
const videoRef = ref<HTMLVideoElement | null>(null);

/* ******** Set webcam & permission ******** */
const { videoInputs: cameras } = useDevicesList({
  requestPermissions: true,
  onUpdated() {
    if (!cameras.value.find((i) => i.deviceId === currentCamera.value))
      currentCamera.value = cameras.value[1]?.deviceId;
  },
});

const { stream, enabled } = useUserMedia({
  constraints: reactive({
    video: computed(() =>
      currentCamera.value
        ? { deviceId: { exact: currentCamera.value } }
        : { facingMode: { exact: 'environment' } },
    ),
  }),
});

watchEffect(() => {
  if (videoRef.value) videoRef.value.srcObject = stream.value!;
});

/* **************************** */

const canvasRef = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);

const canvasWidth = width.value;
const canvasWHeight = height.value - 75;

const squareSize = 20;

// Rectangle coordinates and size
const rect = ref({
  x: 0,
  y: 20,
  width: canvasWidth,
  height: 200,
  lineWidth: 5,
});

// Drag state
let isDragging = false;
let isResizing = false;
let offsetX = 0;
let offsetY = 0;

function drawRect() {
  if (!ctx.value) return;

  ctx.value.beginPath();
  ctx.value.rect(rect.value.x, rect.value.y, rect.value.width, rect.value.height);
  ctx.value.lineWidth = rect.value.lineWidth;
  ctx.value.strokeStyle = '#31ccec';
  ctx.value.stroke();
  ctx.value.fillStyle = '#31ccec';
  ctx.value.fillRect(
    rect.value.x + rect.value.width - squareSize,
    rect.value.y + rect.value.height - squareSize,
    squareSize,
    squareSize,
  );
}

function startDrag(event: MouseEvent | TouchEvent) {
  let mouseX;
  let mouseY;
  const canvasPosition = canvasRef.value!.getBoundingClientRect();
  if (event instanceof MouseEvent) {
    mouseX = event.offsetX;
    mouseY = event.offsetY;
  } else {
    const touch = event.touches[0] || event.changedTouches[0];
    mouseX = touch!.clientX - canvasPosition.left;
    mouseY = touch!.clientY - canvasPosition.top;
  }

  // isResizing
  if (
    mouseX >= rect.value.x + rect.value.width - squareSize &&
    mouseX <= rect.value.x + rect.value.width &&
    mouseY >= rect.value.y + rect.value.height - squareSize &&
    mouseY <= rect.value.y + rect.value.height
  ) {
    isResizing = true;
    offsetX = mouseX - rect.value.width;
    offsetY = mouseY - rect.value.height;
    return;
  }
  // isDragging

  if (
    mouseX >= rect.value.x &&
    mouseX <= rect.value.x + rect.value.width &&
    mouseY >= rect.value.y &&
    mouseY <= rect.value.y + rect.value.height
  ) {
    isDragging = true;
    offsetX = mouseX - rect.value.x;
    offsetY = mouseY - rect.value.y;
    return;
  }
}

function onDrag(event: MouseEvent | TouchEvent) {
  if (!isDragging && !isResizing) return;
  const canvasPosition = canvasRef.value!.getBoundingClientRect();

  let mouseX;
  let mouseY;
  if (event instanceof MouseEvent) {
    mouseX = event.offsetX;
    mouseY = event.offsetY;
  } else {
    const touch = event.touches[0] || event.changedTouches[0];
    mouseX = touch!.clientX - canvasPosition.left;
    mouseY = touch!.clientY - canvasPosition.top;
  }

  // les coordonnées souhaitées, le point de départ de la souris - son deplacement
  const desiredX = mouseX - offsetX;
  const desiredY = mouseY - offsetY;

  if (isDragging) {
    // limite les possibilités de x et y
    rect.value.x = Math.min(
      Math.max(0, desiredX), // la valeur minimal sera 0
      canvasRef.value!.width - rect.value.width, // la valeur max sera canvas - rect widht
    );

    rect.value.y = Math.min(Math.max(0, desiredY), canvasRef.value!.height - rect.value.height);
  }
  if (isResizing) {
    rect.value.width = Math.min(
      Math.max(100, desiredX), // la valeur minimal sera 0
      canvasRef.value!.width - rect.value.x, // la valeur max sera canvas - rect width
    );
    rect.value.height = Math.min(Math.max(100, desiredY), canvasRef.value!.height - rect.value.y);
  }

  drawRect();
}

function stopDrag() {
  isDragging = false;
  isResizing = false;
}

function drawVideoToCanvas() {
  const canvas = canvasRef.value;
  const video = videoRef.value;
  if (canvas && video) {
    ctx.value = canvas.getContext('2d')!;
    ctx.value.clearRect(0, 0, canvas.width, canvas.height);
    ctx.value.drawImage(video, 0, 0, canvas.width, canvas.height);

    drawRect();
  }
  requestAnimationFrame(drawVideoToCanvas);
}

// Capture only the rectangle area from the video
async function captureRect() {
  const video = videoRef.value;
  if (!video) return;

  // Create a temporary canvas for the cropped image
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = rect.value.width;
  tempCanvas.height = rect.value.height;
  const tempCtx = tempCanvas.getContext('2d')!;

  // Draw only the rectangle area from the video
  tempCtx.drawImage(
    video,
    (rect.value.x / canvasRef.value!.width) * video.videoWidth, // source x
    (rect.value.y / canvasRef.value!.height) * video.videoHeight, // source y
    (rect.value.width / canvasRef.value!.width) * video.videoWidth, // source width
    (rect.value.height / canvasRef.value!.height) * video.videoHeight, // source height
    0,
    0,
    rect.value.width,
    rect.value.height, // destination
  );

  // Générer une image base64
  const base64Image = tempCanvas.toDataURL('image/jpeg');

  try {
    const response = await fetch(`${process.env.API}/ocrCapture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: base64Image }),
    });

    const data = await response.json();

    // // load the quote
    newQuote.value!.content = data.text;
    // go to edit
    emits('next-step');
    // stop camera
    enabled.value = false;
  } catch (error) {
    console.error('Erreur OCR:', error);
  }
}

onMounted(() => {
  // prepare canvas for video
  drawVideoToCanvas();
  // start webcam
  enabled.value = true;
});

onUnmounted(() => {
  // stop webcam
  enabled.value = false;
});
</script>

<style scoped></style>
