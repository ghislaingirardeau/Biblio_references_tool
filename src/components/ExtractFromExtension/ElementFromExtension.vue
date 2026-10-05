<template>
  <q-spinner-ios v-if="isSavingQuote" color="primary" size="4em" />
</template>

<script setup lang="ts">
import { useQuotesStore } from 'src/stores/quotes';
import type { Quote } from 'src/types/references';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useSentToOcr } from 'src/utils/useSentToOcr';
import { useProjectsStore } from 'src/stores/projects';
import { storeToRefs } from 'pinia';

const QuotesStore = useQuotesStore();
const route = useRoute();

const ProjectsStore = useProjectsStore();
const { projectId } = storeToRefs(ProjectsStore);

const isSavingQuote = ref(false);
const screenshot = ref(null);
const newQuote = ref<Quote>({
  id: 'quote_' + Date.now().toString(),
  page: '0',
  content: '',
  tag: null,
  reference_id: null,
  project_id: null,
});

onMounted(() => {
  window.addEventListener('EXTENSION_SELECTED_TEXT', handleSelectedText);
  window.addEventListener('EXTENSION_SCREENSHOT', handleScreenshot);
});

onBeforeUnmount(() => {
  window.removeEventListener('EXTENSION_SELECTED_TEXT', handleSelectedText);
  window.removeEventListener('EXTENSION_SCREENSHOT', handleScreenshot);
});

function handleSelectedText(event: any) {
  isSavingQuote.value = true;

  const text = event.detail.text;

  console.log('Texte reçu depuis extension :', text);

  newQuote.value.content = text;

  void saveQuote();
}

function handleScreenshot(event: any) {
  console.log('Capture reçue depuis extension', event);

  isSavingQuote.value = true;

  const image = event.detail?.image;

  if (!image) {
    console.warn('Aucune image dans le message');

    return;
  }

  console.log('Image reçue !');

  screenshot.value = image;

  void useSentToOcr(image, newQuote.value, () => {
    void saveQuote();
  });
}

async function saveQuote() {
  newQuote.value.project_id = projectId.value;
  newQuote.value.reference_id = encodeURIComponent(route.params.id as string);

  await QuotesStore.addQuote(
    route.params.type as string,
    route.params.id as string,
    newQuote.value,
  );
  isSavingQuote.value = false;
}
</script>

<style scoped></style>
