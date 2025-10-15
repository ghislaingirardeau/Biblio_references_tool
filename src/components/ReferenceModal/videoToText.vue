<template>
  <div class="flex">
    <vue-cropper
      v-if="previewUrl"
      ref="cropper"
      :key="previewUrl"
      :src="previewUrl"
      alt="Source Image"
      class="w-full"
      :viewMode="1"
      :autoCropArea="0"
      @ready="onCropperReady"
      @cropend="cropImage"
    >
    </vue-cropper>
    <canvas
      v-else
      ref="canvasRef"
      :width="canvasWidth"
      :height="canvasWHeight"
      style="touch-action: none"
    />
    <video ref="videoRef" style="display: none" autoplay playsinline />
    <div class="w-full flex m-3 justify-around">
      <q-btn outline color="primary" @click="modalReferenceStore.reset()" label="Close" />

      <q-btn
        v-if="previewUrl"
        color="positive"
        label="Photo"
        :loading="loading"
        :disable="loading"
        @click="reloadCanvasVideo"
      />
      <q-btn
        v-if="previewUrl"
        color="primary"
        label="Extract"
        :loading="loading"
        :disable="loading"
        @click="sendToOCR"
      />
      <q-btn v-else @click="captureImage" color="primary" label="Capture" />
    </div>
  </div>
</template>

<script setup lang="ts">
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import { useDevicesList, useUserMedia, useWindowSize } from '@vueuse/core';
import { computed, onMounted, onUnmounted, reactive, ref, shallowRef, watchEffect } from 'vue';
import { useModalReferenceStore } from 'src/stores/modalReferences';
import { Notify } from 'quasar';
import type { Quote } from 'src/types/references';

const videoRef = ref<HTMLVideoElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);

const modalReferenceStore = useModalReferenceStore();
const { width, height } = useWindowSize();
const canvasWidth = computed(() => width.value);
const canvasWHeight = computed(() => height.value - 135);
const currentCamera = shallowRef<string>();

const previewUrl = ref<string | null>(null);
const cropper = ref<any>(null);
const imageCropped = ref<ImageData | null>(null);

const newQuote = defineModel<Quote>('newQuote');
const emits = defineEmits(['next-step']);

const loading = ref(false);

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
        : {
            /* facingMode: { exact: 'environment' }  */
          },
    ),
  }),
});

watchEffect(() => {
  try {
    if (videoRef.value && stream.value) {
      videoRef.value.srcObject = stream.value;
    }
  } catch (err: any) {
    console.error('Error starting video:', err);
    Notify.create({
      message:
        err.name === 'NotReadableError'
          ? 'Camera already in use by another app.'
          : 'Unable to access camera.',
      color: 'negative',
    });
    enabled.value = false;
  }
});

/* **************************** */

function captureImage() {
  const video = videoRef.value;
  if (!video || !canvasRef.value) return;

  // Stop animation to freeze the canvas
  stopCanvasAnimation();
  //   enabled.value = false;

  // Dessine la zone capturée dans le canvas principal
  const canvas = canvasRef.value;
  const context = canvas.getContext('2d')!;
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageBase64 = canvas.toDataURL('image/jpeg');
  previewUrl.value = imageBase64;
}

function cropImage() {
  const options = { maxWidth: 1100, maxHeight: 1100 };
  imageCropped.value = cropper.value!.getCroppedCanvas(options).toDataURL('image/jpeg');
}

async function sendToOCR() {
  try {
    loading.value = true;
    const response = await fetch(`${process.env.API}/ocrCapture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: imageCropped.value }),
    });

    const data = await response.json();

    newQuote.value!.content = data.text;

    emits('next-step');
  } catch (err) {
    Notify.create({
      message: 'Error: extracting text.',
      color: 'negative',
      icon: 'system_update',
      timeout: 3000,
    });
  } finally {
    loading.value = false;
  }
}

let animationFrameId: number | null = null;

function launchCanvasAnimation() {
  const canvas = canvasRef.value;
  const video = videoRef.value;
  if (canvas && video) {
    ctx.value = canvas.getContext('2d')!;
    ctx.value.clearRect(0, 0, canvas.width, canvas.height);
    ctx.value.drawImage(video, 0, 0, canvas.width, canvas.height);
  }
  animationFrameId = requestAnimationFrame(launchCanvasAnimation);
}

function stopCanvasAnimation() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

function reloadCanvasVideo() {
  previewUrl.value = null;
  videoRef.value = null;
  canvasRef.value = null;
  enabled.value = true;
  launchCanvasAnimation();
}

function onCropperReady() {
  cropper.value.setCropBoxData({
    top: 50,
    width: 400,
    height: 400,
  });
}

onMounted(() => {
  launchCanvasAnimation();
  enabled.value = true;
});

onUnmounted(() => {
  // stop webcam
  enabled.value = false;
  stopCanvasAnimation();
});
</script>

<style scoped></style>
