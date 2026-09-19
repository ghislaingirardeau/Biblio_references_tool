<template>
  <img v-if="screenshot" :src="screenshot" alt="Capture" style="max-width: 500px" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const screenshot = ref(null);

function handleScreenshot(event: any) {
  console.log('Capture reçue depuis extension', event);

  console.log(event.detail);

  const image = event.detail?.image;

  if (!image) {
    console.warn('Aucune image dans le message');

    return;
  }

  console.log('Image reçue !');

  screenshot.value = image;
}

onMounted(() => {
  window.addEventListener('EXTENSION_SCREENSHOT', handleScreenshot);
});

onBeforeUnmount(() => {
  window.removeEventListener('EXTENSION_SCREENSHOT', handleScreenshot);
});
</script>

<style scoped></style>
