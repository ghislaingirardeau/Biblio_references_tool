<template>
  <div class="flex my-2">
    <video ref="videoElement" class="rounded-md h-80 w-full" />
    <p class="mt-2 font-bold italic">
      {{ codeBarMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core';
import { onBeforeUnmount, onMounted, ref } from 'vue';

const emit = defineEmits(['detection-isbn']);

const isScanning = defineModel<boolean>('isScanning');

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const BarcodeDetector = window.BarcodeDetector;

const barcodeDetected = ref<string | null>(null);
const codeBarMessage = ref<string | null>();

const videoElement = ref<HTMLVideoElement | null>(null);
const imagePreview = ref<string | null>(null);

async function startCamera() {
  try {
    isScanning.value = true;
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
      },
      audio: false,
    });
    if (videoElement.value) {
      videoElement.value.srcObject = stream;
      videoElement.value.onloadedmetadata = async () => {
        await videoElement.value?.play();
      };
    }
  } catch (error) {
    isScanning.value = false;
    console.log(error);
  }
}

function stopCamera() {
  (videoElement.value?.srcObject as MediaStream)?.getTracks().forEach((track) => {
    track.stop();
  });

  getBarcodeFromVideoInterval.pause();
}

// Toutes les 3s, on extrait une image de la vidéo
const getBarcodeFromVideoInterval = useIntervalFn(() => {
  console.log('useIntervalFn');
  if (!('BarcodeDetector' in window) || !window.BarcodeDetector) {
    isScanning.value = false;
    return;
  }
  extractPictureFromVideo();
}, 3000);

// Fonction pour extraire une image de la vidéo
// Une fois l'image construite, la passer à la détection de code-barres
function extractPictureFromVideo() {
  if (videoElement.value) {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.value.videoWidth;
    canvas.height = videoElement.value.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(videoElement.value, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png');
      imagePreview.value = imageData;
      const imageEl = document.createElement('img');
      imageEl.src = imageData;
      // Attendre que l'image soit complètement chargée
      imageEl.onload = async () => {
        await detectBarcode(imageEl);
      };
      imageEl.onerror = () => {
        isScanning.value = false;
        console.error("Impossible d'extraire l'image");
        codeBarMessage.value = "Impossible d'extraire l'image";
      };
    }
  }
}

// Fonction pour détecter un code-barres dans une image
const detectBarcode = async (imageElement: HTMLImageElement) => {
  try {
    codeBarMessage.value = "Détection en cours..., garder l'image stable pendant 3s";
    const barcodeDetector = new BarcodeDetector({
      formats: [
        'qr_code',
        'code_128',
        'ean_13',
        'code_39',
        'code_93',
        'codabar',
        'ean_8',
        'itf',
        'upc_a',
        'upc_e',
      ],
    });
    const barcodes = await barcodeDetector.detect(imageElement);
    if (barcodes.length > 0) {
      barcodeDetected.value = barcodes[0].rawValue;
      codeBarMessage.value = 'Code-barre détecté !';

      emit('detection-isbn', barcodeDetected.value);

      // si il y a un code bar detecté, on stop la camera et l'interval
      stopCamera();
    }
  } catch (error) {
    console.error('Erreur lors de la détection :', error);
    isScanning.value = false;
    // si il y a erreur on stop la camera et l'interval
    stopCamera();
    codeBarMessage.value = 'Erreur lors de la détection';
  }
};

onMounted(async () => {
  if (!('BarcodeDetector' in window) || !window.BarcodeDetector) {
    isScanning.value = false;
    codeBarMessage.value =
      'BarcodeDetector ne fonctionne pas sur laptop, merci de saisir manuellement le code barre';
    return;
  }
  await startCamera();
});

onBeforeUnmount(() => {
  stopCamera();
});
</script>

<style scoped></style>
