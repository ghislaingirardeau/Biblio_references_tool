<template>
  <q-stepper v-model="step" ref="stepperRef" color="primary" animated>
    <q-step :name="1" title="Quote" icon="settings" :done="step > 1" class="text-black">
      <VideoToImgCanvas v-if="useIsMobile()" v-model:newQuote="newQuote" @next-step="step = 2" />
      <ImageToText v-else v-model:newQuote="newQuote" @next-step="step = 2" />
    </q-step>

    <q-step :name="2" title="Edit" icon="create_new_folder" :done="step > 2" class="text-black">
      <QuoteEdit v-model:newQuote="newQuote" />
    </q-step>

    <template v-slot:navigation>
      <q-stepper-navigation>
        <q-btn
          v-if="step === 1"
          @click="stepperRef?.next()"
          outline
          color="primary"
          label="Type Quote"
        />
        <q-btn
          v-if="step === 2"
          @click="saveQuote"
          :loading="isSearchingReference"
          color="primary"
          label="Save"
        />
        <q-btn
          v-if="step > 1"
          flat
          color="primary"
          @click="stepperRef?.previous()"
          label="Back"
          class="q-ml-sm"
        />
      </q-stepper-navigation>
    </template>
  </q-stepper>
</template>

<script setup lang="ts">
import { useModalReferenceStore } from 'src/stores/modalReferences';
import { useReferencesStore } from 'src/stores/references';
import type { Quote } from 'src/types/books';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import QuoteEdit from './QuoteEdit.vue';
import VideoToImgCanvas from './videoToImgCanvas.vue';
import { useIsMobile } from 'src/utils/useDeviceInfo';
import ImageToText from './imageToText.vue';

const step = ref(1);
const stepperRef = ref();

const isSearchingReference = ref(false);

const newQuote = ref<Quote>({
  id: Date.now().toString(),
  page: '0',
  content: '',
});

const referenceStore = useReferencesStore();
const modalReferenceStore = useModalReferenceStore();

const route = useRoute();

function saveQuote() {
  referenceStore.addQuote(route.params.type as string, route.params.id as string, newQuote.value);
  modalReferenceStore.reset();
}
</script>

<style scoped></style>
