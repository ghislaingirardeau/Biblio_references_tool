<template>
  <q-btn v-if="isElectron" label="Add quote from clipboard" @click="createNewQuote" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useProjectsStore } from 'src/stores/projects';
import { useQuotesStore } from 'src/stores/quotes';
import type { ReferencesType } from 'src/types/references';
import { useDesktop } from 'src/utils/useElectron';
import { useRoute } from 'vue-router';

const QuotesStore = useQuotesStore();
const { newQuote, loadingQuotes } = storeToRefs(QuotesStore);
const { isElectron, readClipboard } = useDesktop();
const ProjectsStore = useProjectsStore();
const { projectId } = storeToRefs(ProjectsStore);

const route = useRoute();

const createNewQuote = async () => {
  loadingQuotes.value = true;

  QuotesStore.resetNewQuote();

  const text = await readClipboard();

  newQuote.value.content = text;

  await saveQuote();
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
