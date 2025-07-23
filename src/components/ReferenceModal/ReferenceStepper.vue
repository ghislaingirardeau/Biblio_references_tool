<template>
  <q-stepper v-model="step" ref="stepperRef" color="primary" animated>
    <q-step :name="1" title="Book" icon="settings" :done="step > 1" class="text-black">
      <BarcodeDetection
        v-if="useIsMobile()"
        @detection-isbn="handleDetectionComplete"
        v-model:isScanning="isScanning"
      />
      <q-separator />
      <q-input
        filled
        v-model="identifier"
        label="Reference Identifier (ISBN or DOI)"
        placeholder="976-xxxxx OR 10.YYY/XXXXX"
        class="mb-2 mt-2"
      />
      <span v-if="errorMessage" class="text-red">{{ errorMessage }}</span>
    </q-step>

    <q-step :name="2" title="Edit" icon="create_new_folder" :done="step > 2" class="text-black">
      <EditBookForm v-if="route.params.type === 'books'" v-model:editReference="newReference" />
      <EditArticleFrom
        v-if="route.params.type === 'articles'"
        v-model:editReference="newReference"
      />
    </q-step>

    <template v-slot:navigation>
      <q-stepper-navigation>
        <q-btn
          @click="modalAction"
          :loading="isSearchingReference"
          :disable="useIsMobile() && isScanning && step === 1"
          color="primary"
          :label="step === 2 ? 'Save' : 'Find'"
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
import type { Article, Book } from 'src/types/books';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import BarcodeDetection from './BarcodeDetection.vue';
import { useIsMobile } from 'src/utils/useDeviceInfo';
import EditBookForm from '../Edit/EditBookForm.vue';
import EditArticleFrom from '../Edit/EditArticleFrom.vue';

const step = ref(1);
const stepperRef = ref();

const identifier = ref('10.1177/097215091001200110');
const isSearchingReference = ref(false);
const isScanning = ref(true);

const newReference = ref<Book | Article>({ id: null });

const referenceStore = useReferencesStore();
const modalReferenceStore = useModalReferenceStore();

async function modalAction() {
  if (step.value === 1) {
    await findReference();
  } else {
    saveReference();
  }
}

const route = useRoute();

function saveReference() {
  referenceStore.add(route.params.type as string, newReference.value);
  modalReferenceStore.reset();
}

const errorMessage = ref<null | string>(null);

function url() {
  return route.params.type === 'books'
    ? `https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(identifier.value)}&maxResults=1`
    : `https://api.crossref.org/works/${encodeURIComponent(identifier.value)}`;
}

async function findReference() {
  try {
    isSearchingReference.value = true;
    errorMessage.value = null;

    const response = await fetch(url());
    if (response.ok) {
      const result = await response.json();
      const referenceFound =
        route.params.type === 'books'
          ? (result.items[0].volumeInfo as Book)
          : formatArticleData(result.message);
      referenceFound.id = identifier.value;
      newReference.value = referenceFound;
      stepperRef?.value.next();
    }
  } catch (error) {
    console.log(error);
    errorMessage.value = 'Reference not found';
  }
  isSearchingReference.value = false;
}

interface RawArticle extends Article {
  author?: { family: string; given: string }[];
  created: { timestamp: number };
}

function formatArticleData(article: RawArticle) {
  const author = article.author?.map((a) => a.family + ' ' + a.given);
  const { id, title, publisher, DOI, language, quotes, volume, issue, page, URL } = article;
  const publishedDate = article.created.timestamp.toString();
  const formatedArticle = {
    id,
    title: title![0],
    authors: author,
    publishedDate,
    publisher,
    DOI,
    quotes,
    volume,
    issue,
    page,
    language,
    URL,
  };
  return formatedArticle as Article;
}

async function handleDetectionComplete(payload: string) {
  identifier.value = payload;
  await findReference();
}
</script>

<style scoped></style>
