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

const QuotesStore = useQuotesStore();
const { newQuote, loadingQuotes } = storeToRefs(QuotesStore);
const { isElectron } = useDesktop();
const ProjectsStore = useProjectsStore();
const { projectId } = storeToRefs(ProjectsStore);

const route = useRoute();

/* ---------------------------------------------------------------- */

const screenshot = ref<string | null>(null);

const retrieveCapture = async () => {
  const image = await window.electronAPI.getSnippingResult();

  if (!image) {
    console.warn('Aucune capture disponible');
    return;
  }

  screenshot.value = image;
  await runOCR();
};

/* ---------------------------------------------------------------- */

const isProcessing = ref(false);
let worker = null as any;

async function runOCR() {
  if (!screenshot.value) return;

  isProcessing.value = true;

  QuotesStore.resetNewQuote();

  try {
    // fra
    worker = await createWorker('eng', 1, {
      logger: (message) => {
        console.log(message);
      },
    });

    const result = await worker.recognize(screenshot.value);

    newQuote.value.content = result.data.text;

    await saveQuote();
  } catch (error) {
    console.error('Erreur OCR:', error);
  } finally {
    if (worker) {
      await worker.terminate();
      worker = null;
    }

    isProcessing.value = false;
  }
}

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
