<template>
  <q-dialog
    v-model="showEditModal!"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    @hide="ModalReference.isReadonly = false"
  >
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Edit</div>
        <q-space />
        <q-btn icon="close" color="primary" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="row items-center">
        <QuoteEdit v-if="$route.params.id" v-model:editQuote="selectedReference!" />
        <ReferenceEdit v-else v-model:editReference="selectedReference!" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Close" outline color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { ReferenceContent } from 'src/types/references';
import QuoteEdit from './QuoteModal/QuoteEdit.vue';
import { useModalReferenceStore } from 'src/stores/modalReferences';
import ReferenceEdit from './ReferenceModal/ReferenceEdit.vue';

const showEditModal = defineModel<boolean>('showEditModal');
const selectedReference = defineModel<ReferenceContent>('selectedReference');

const ModalReference = useModalReferenceStore();
</script>

<style scoped></style>
