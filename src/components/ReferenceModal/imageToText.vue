<template>
  <div class="p-2 flex">
    <q-file v-model="image" label="Upload image to extract text" filled class="w-72 mr-5" />
    <q-btn :loading="loading" color="primary" @click="sendToOCR" label="extract text" />
    <q-btn
      outline
      color="primary"
      @click="modalReferenceStore.reset()"
      label="Close"
      class="q-ml-md"
    />
  </div>
</template>

<script setup lang="ts">
import { useModalReferenceStore } from 'src/stores/modalReferences';
import type { Quote } from 'src/types/books';
import { ref } from 'vue';

const modalReferenceStore = useModalReferenceStore();

const image = ref<File | null>(null);
const result = ref('');
const loading = ref(false);

const newQuote = defineModel<Quote>('newQuote');
const emits = defineEmits(['next-step']);

async function sendToOCR() {
  if (!image.value) return;

  loading.value = true;
  result.value = '';

  const formData = new FormData();
  formData.append('image', image.value);

  try {
    const response = await fetch(`${process.env.API}/ocrFile`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    newQuote.value!.content = data.text;
    emits('next-step');
  } catch (err) {
    result.value = 'Erreur lors de la requête OCR';
    console.error(err);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
