<template>
  <q-dialog
    v-model="open"
    persistent
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
    @hide="closeModal"
  >
    <ReferenceStepper v-if="props.modalMode === 'reference'" />
    <QuoteStepper v-else />
  </q-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useModalReferenceStore } from 'src/stores/modalReferences';
import { computed, ref } from 'vue';
import ReferenceStepper from './ReferenceModal/ReferenceStepper.vue';
import QuoteStepper from './ReferenceModal/QuoteStepper.vue';

const modalReferenceStore = useModalReferenceStore();
const { open } = storeToRefs(modalReferenceStore);
const maximizedToggle = ref(true);

function closeModal() {
  modalReferenceStore.reset();
}

const props = defineProps({
  modalMode: {
    type: String,
    default: 'reference',
  },
});
</script>

<style scoped></style>
