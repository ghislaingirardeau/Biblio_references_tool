<template>
  <span></span>
</template>

<script setup lang="ts">
import { getAuth } from 'firebase/auth';
import { Notify } from 'quasar';
import { useQuotesStore } from 'src/stores/quotes';
import type { Quote } from 'src/types/references';
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

  void sendToOCR();
}

async function sendToOCR() {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    const token = await user!.getIdToken();
    const response = await fetch(`${process.env.API}/ocrCapture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ imageBase64: screenshot.value, user: { uid: user?.uid } }),
    });

    const data = await response.json();

    newQuote.value.content = data.text;

    await saveQuote();
  } catch (err) {
    Notify.create({
      message: 'Error: extracting text.',
      color: 'negative',
      icon: 'system_update',
      timeout: 3000,
    });
  }
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
