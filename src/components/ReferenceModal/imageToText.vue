<template>
  <div>
    <q-file v-model="image" label="Pick one file" filled style="max-width: 300px" />
    <q-btn
      flat
      :loading="loading"
      color="primary"
      @click="sendToOCR"
      label="extract text"
      class="q-ml-sm"
    />
  </div>
</template>

<script setup lang="ts">
import type { Quote } from 'src/types/books';
import { ref } from 'vue';

const image = ref<File | null>(null);
const result = ref('');
const loading = ref(false);

const newQuote = defineModel<Quote>('newQuote');
const emits = defineEmits(['next-step']);

async function sendToOCR() {
  if (!image.value) return;

  loading.value = true;
  result.value = '';

  const base64 = await toBase64(image.value);

  const formData = new URLSearchParams();
  formData.append('apikey', 'K86384102188957'); // Clé publique de test
  formData.append('language', 'fre'); // ou eng, spa, etc.
  formData.append('base64Image', String(base64));
  formData.append('isOverlayRequired', 'false');

  try {
    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });

    const data = await response.json();
    result.value = data.ParsedResults?.[0]?.ParsedText || 'Aucun texte reconnu.';
    newQuote.value!.content = result.value;
    emits('next-step');
  } catch (err) {
    result.value = 'Erreur lors de la requête OCR';
    console.error(err);
  } finally {
    loading.value = false;
  }
}

function toBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
</script>

<style scoped></style>
