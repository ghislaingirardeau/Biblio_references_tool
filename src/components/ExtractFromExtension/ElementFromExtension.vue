<template><span></span></template>

<script setup lang="ts">
import { useQuotesStore } from 'src/stores/quotes';
import type { Quote, ReferencesType } from 'src/types/references';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useSentToOcr } from 'src/utils/useSentToOcr';
import { useProjectsStore } from 'src/stores/projects';
import { storeToRefs } from 'pinia';

const QuotesStore = useQuotesStore();
const { loadingQuotes, newQuote } = storeToRefs(QuotesStore);

const route = useRoute();

const ProjectsStore = useProjectsStore();
const { projectId } = storeToRefs(ProjectsStore);

const screenshot = ref(null);

onMounted(() => {
  window.addEventListener('EXTENSION_SELECTED_TEXT', handleSelectedText);
  window.addEventListener('EXTENSION_SCREENSHOT', handleScreenshot);
});

onBeforeUnmount(() => {
  window.removeEventListener('EXTENSION_SELECTED_TEXT', handleSelectedText);
  window.removeEventListener('EXTENSION_SCREENSHOT', handleScreenshot);
});

function handleSelectedText(event: any) {
  loadingQuotes.value = true;

  QuotesStore.resetNewQuote();

  const text = event.detail.text;

  console.log('Texte reçu depuis extension :', text);

  newQuote.value.content = text;

  void saveQuote();
}

function handleScreenshot(event: any) {
  void processScreenshot(event);
}

async function processScreenshot(event: any) {
  console.log('Capture reçue depuis extension', event);

  loadingQuotes.value = true;

  QuotesStore.resetNewQuote();

  const image = event.detail?.image;

  if (!image) {
    console.warn('Aucune image dans le message');

    return;
  }

  console.log('Image reçue !');

  screenshot.value = image;

  newQuote.value.content = await useSentToOcr(image, '/ocrCapture');

  await saveQuote();
}

async function saveQuote() {
  await QuotesStore.addQuote(
    projectId.value,
    route.params.type as keyof ReferencesType,
    encodeURIComponent(route.params.id as string),
  );
  loadingQuotes.value = false;
}
</script>

<style scoped></style>
