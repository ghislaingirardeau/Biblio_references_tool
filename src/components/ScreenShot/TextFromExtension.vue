<template>
  <div>{{ searchText }}</div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const searchText = ref('TEST');

onMounted(() => {
  window.addEventListener('EXTENSION_SELECTED_TEXT', handleSelectedText);
});

onBeforeUnmount(() => {
  window.removeEventListener('EXTENSION_SELECTED_TEXT', handleSelectedText);
});

function handleSelectedText(event: any) {
  const text = event.detail.text;

  console.log('Texte reçu depuis extension :', text);

  // Exemple :
  searchText.value = text;
}
</script>

<style scoped></style>
