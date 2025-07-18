<template>
  <q-dialog
    v-model="open"
    persistent
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
    @hide="closeModal"
  >
    <q-card class="bg-primary text-white">
      <q-bar>
        <q-space />

        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section>
        <div class="text-h6">{{ title }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <ReferenceStepper v-if="props.modalMode === 'reference'" />
        <QuoteStepper v-else />
      </q-card-section>
    </q-card>
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

const title = computed(() => {
  return props.modalMode === 'reference' ? 'Add a reference' : 'Add a quote';
});
</script>

<style scoped></style>
