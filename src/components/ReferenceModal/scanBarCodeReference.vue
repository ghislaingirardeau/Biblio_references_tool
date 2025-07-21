<template>
  <div>
    <p v-if="isFetchingBookData">Fetching book data... {{ isbn }}</p>
    <BarcodeDetection v-else @detection-isbn="isbnBookData" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BarcodeDetection from './BarcodeDetection.vue';

const emit = defineEmits(['goToEdit']);

const isFetchingBookData = ref(false);
const isbn = ref('');

async function isbnBookData(payload: string) {
  try {
    isFetchingBookData.value = true;
    isbn.value = payload;
    const response = await fetch(`/api/book?isbn=${payload}`);
    // article?doi=
    if (response.ok) {
      const result = await response.json();
      isFetchingBookData.value = false;
      emit('goToEdit');
    }
  } catch (error) {
    console.log(error);
  }
}
</script>

<style scoped></style>
