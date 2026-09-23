<template>
  <span></span>
</template>

<script setup lang="ts">
import { useQuotesStore } from 'src/stores/quotes';
import type { Quote } from 'src/types/references';
import { useSentToOcr } from 'src/utils/useSentToOcr';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const QuotesStore = useQuotesStore();
const route = useRoute();

const screenshot = ref(null);
const isSavingQuote = ref(false);
const newQuote = ref<Quote>({
  id: Date.now().toString(),
  page: '0',
  content: '',
  tag: null,
});

function handleScreenshot(event: any) {
  console.log('Capture reçue depuis extension', event);

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
  isSavingQuote.value = true;
  await QuotesStore.addQuote(
    route.params.type as string,
    route.params.id as string,
    newQuote.value,
  );
  isSavingQuote.value = false;
}

onMounted(() => {
  window.addEventListener('EXTENSION_SCREENSHOT', handleScreenshot);
});

onBeforeUnmount(() => {
  window.removeEventListener('EXTENSION_SCREENSHOT', handleScreenshot);
});
</script>

<style scoped></style>
