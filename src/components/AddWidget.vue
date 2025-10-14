<template>
  <q-page-sticky position="bottom-right" :offset="[18, 18]">
    <q-btn fab icon="add" color="primary" @click="openModal" />
  </q-page-sticky>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useModalReferenceStore } from 'src/stores/modalReferences';

const ModalReference = useModalReferenceStore();
const { open } = storeToRefs(ModalReference);

function openModal() {
  open.value = true;
}
</script>

<style scoped></style>
