<template>
  <q-stepper v-model="step" ref="stepperRef" color="primary" header-nav animated>
    <q-step
      :name="1"
      :title="route.params.type === 'books' ? 'Add Book' : 'Add Article'"
      icon="settings"
      :done="step > 1"
      class="text-black"
    >
      <BarcodeDetection
        v-if="useIsMobile()"
        @detection-isbn="handleDetectionComplete"
        v-model:isScanning="isScanning"
      />
      <q-separator v-if="useIsMobile()" />
      <q-input
        filled
        v-model="identifier"
        label="Reference Identifier (ISBN or DOI)"
        :placeholder="
          route.params.type === 'books' ? '9780299326104' : '10.1177/097215091001200110'
        "
        class="mb-2 mt-2"
      />
      <span v-if="errorMessage" class="text-red">{{ errorMessage }}</span>
    </q-step>

    <q-step :name="2" title="Edit" icon="create_new_folder" :done="step > 2" class="text-black">
      <EditBookForm v-if="route.params.type === 'books'" v-model:editReference="newReference" />
      <EditArticleForm
        v-if="route.params.type === 'articles'"
        v-model:editReference="newReference"
      />
      <EditForm v-else v-model:editReference="newReference" />
    </q-step>

    <template v-slot:navigation>
      <q-stepper-navigation>
        <q-btn
          @click="modalActionFind"
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
import { useReferencesStore } from 'src/stores/references';
import type { Article, Book, Thesis } from 'src/types/books';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import BarcodeDetection from './BarcodeDetection.vue';
import { useIsMobile } from 'src/utils/useDeviceInfo';
import EditBookForm from '../Edit/EditBookForm.vue';
import EditArticleForm from '../Edit/EditArticleForm.vue';
import type { RawArticle } from 'src/types/API';
import EditForm from '../Edit/EditForm.vue';
import { referencesTemplate } from 'src/utils/useBaseReferences';

const route = useRoute();

const step = ref(1);
const stepperRef = ref();

const identifier = ref('');
const isSearchingReference = ref(false);
const isScanning = ref(true);

const newReference = ref<Book | Article | Thesis>({
  id: null,
});

const isbnRegex = /^(97(8|9))?\d{9}(\d|X)$/i;

const referenceStore = useReferencesStore();
const modalReferenceStore = useModalReferenceStore();

onMounted(() => {
  const type = route.params.type as keyof typeof referencesTemplate;
  newReference.value = referencesTemplate[type].template;
});

async function modalActionFind() {
  if (step.value === 1) {
    await findReference();
  } else {
    saveReference();
  }
}

function saveReference() {
  referenceStore.add(route.params.type as string, newReference.value);
  modalReferenceStore.reset();
}

const errorMessage = ref<null | string>(null);

function url() {
  return isbnRegex.test(identifier.value)
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
      console.log(result);
      const referenceFound = isbnRegex.test(identifier.value)
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

function formatArticleData(article: RawArticle) {
  const author = article.author?.map((a) => a.family + ' ' + a.given);
  const { id, title, publisher, DOI, language, quotes, volume, issue, page, URL, type } = article;
  console.log(article);
  const publishedDate = article?.['published-print']?.['date-parts']?.[0]?.[0];
  const formatedArticle = {
    id,
    title: title![0],
    authors: author,
    journal: article['container-title'][0],
    publishedDate,
    publisher,
    DOI,
    quotes,
    volume,
    issue,
    page,
    language,
    URL,
    type,
  };
  return formatedArticle as Article;
}

async function handleDetectionComplete(payload: string) {
  identifier.value = payload;
  await findReference();
}
</script>

<style scoped></style>
