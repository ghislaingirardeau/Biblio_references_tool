<template>
  <q-stepper v-model="step" ref="stepperRef" color="primary" header-nav animated>
    <q-step :name="1" title="Scan & Extract" icon="settings" :done="step > 1">
      <!-- <VideoToImgCanvas v-if="useIsMobile()" v-model:newQuote="newQuote" @next-step="step = 2" /> -->
      <VideoToText v-if="useIsMobile()" v-model:newQuote="newQuote" @next-step="step = 2" />
      <ImageToText v-else v-model:newQuote="newQuote" @next-step="step = 2" />
    </q-step>
    <q-step
      :name="2"
      title="Type & Edit"
      icon="create_new_folder"
      :done="step > 2"
      class="edit-quote"
    >
      <QuoteEdit v-model:editQuote="newQuote" />
    </q-step>

    <template v-slot:navigation>
      <q-stepper-navigation v-if="step === 2">
        <q-btn @click="saveQuote" :loading="isSearchingReference" color="primary" label="Save" />
        <q-btn flat color="primary" @click="stepperRef?.previous()" label="Back" class="q-ml-sm" />
        <q-btn
          flat
          color="primary"
          @click="modalReferenceStore.reset()"
          label="Close"
          class="q-ml-sm"
        />
      </q-stepper-navigation>
    </template>
  </q-stepper>
</template>

<script setup lang="ts">
import { useModalReferenceStore } from 'src/stores/modalReferences';
import type { Quote } from 'src/types/references';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import VideoToImgCanvas from 'src/components/ReferenceModal/videoToImgCanvas.vue';
import { useIsMobile } from 'src/utils/useDeviceInfo';
import ImageToText from 'src/components/ReferenceModal/imageToText.vue';
import QuoteEdit from './QuoteEdit.vue';
import { useQuotesStore } from 'src/stores/quotes';
import VideoToText from '../ReferenceModal/videoToText.vue';

const step = ref(1);
const stepperRef = ref();

const isSearchingReference = ref(false);

const newQuote = ref<Quote>({
  id: Date.now().toString(),
  page: '0',
  content: '',
  tag: null,
});

const QuotesStore = useQuotesStore();

const modalReferenceStore = useModalReferenceStore();

const route = useRoute();

async function saveQuote() {
  await QuotesStore.addQuote(
    route.params.type as string,
    route.params.id as string,
    newQuote.value,
  );
  modalReferenceStore.reset();
}
</script>

<style scoped lang="scss">
:deep() {
  .q-stepper__step-inner {
    padding: 0px !important;
  }
  .edit-quote .q-stepper__step-inner {
    height: calc(100vh - 220px);
  }
}
</style>
