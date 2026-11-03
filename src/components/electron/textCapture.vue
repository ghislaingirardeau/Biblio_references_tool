<template>
  <q-btn v-if="isElectron" label="Add quote from capture" @click="createNewQuote" />
  <q-img v-if="screenshot" :src="screenshot" style="max-width: 800px" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useProjectsStore } from 'src/stores/projects';
import { useQuotesStore } from 'src/stores/quotes';
import type { ReferencesType } from 'src/types/references';
import { useDesktop } from 'src/utils/useElectron';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const QuotesStore = useQuotesStore();
const { newQuote, loadingQuotes } = storeToRefs(QuotesStore);
const { isElectron, captureScreen } = useDesktop();
const ProjectsStore = useProjectsStore();
const { projectId } = storeToRefs(ProjectsStore);

const route = useRoute();

const screenshot = ref<string | null>(null);

const createNewQuote = async () => {
  try {
    screenshot.value = await captureScreen();
  } catch (error) {
    console.error('Erreur capture écran :', error);
  }
};

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
