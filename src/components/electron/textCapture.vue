<template>
  <q-btn
    v-if="isElectron"
    label="Add quote from capture"
    @click="retrieveCapture"
    :loading="isProcessing"
    :disable="isProcessing"
  />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useProjectsStore } from 'src/stores/projects';
import { useQuotesStore } from 'src/stores/quotes';
import type { ReferencesType } from 'src/types/references';
import { useDesktop } from 'src/utils/useElectron';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { createWorker } from 'tesseract.js';
import { useSentToOcr } from 'src/utils/useSentToOcr';

const QuotesStore = useQuotesStore();
const { newQuote, loadingQuotes } = storeToRefs(QuotesStore);
const { isElectron } = useDesktop();
const ProjectsStore = useProjectsStore();
const { projectId } = storeToRefs(ProjectsStore);

const route = useRoute();

/* ---------------------------------------------------------------- */

const screenshot = ref<null | string>(null);
const isProcessing = ref(false);

const retrieveCapture = async () => {
  isProcessing.value = true;

  const image = await window.electronAPI.getSnippingResult();

  if (!image) {
    console.warn('Aucune capture disponible');
    return;
  }

  screenshot.value = image;

  newQuote.value.content = await useSentToOcr(screenshot.value, '/ocrCaptureTesseract');

  await saveQuote();

  isProcessing.value = false;
};

/* ---------------------------------------------------------------- */

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
