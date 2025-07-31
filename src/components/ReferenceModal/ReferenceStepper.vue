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
      <ReferenceEdit v-model:editReference="newReference" />
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
          v-if="step === 1"
          @click="step = 2"
          flat
          no-caps
          color="primary"
          label="No identifier ?"
          class="q-ml-sm"
        />
        <q-btn
          v-if="step > 1"
          flat
          color="primary"
          @click="modalBackAction"
          label="Back"
          class="q-ml-sm"
        />
        <q-btn flat color="primary" @click="modalCloseAction" label="Close" class="q-ml-sm" />
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
import type { RawArticle } from 'src/types/API';
import { referencesTemplate } from 'src/utils/useBaseReferences';
import ReferenceEdit from './ReferenceEdit.vue';

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
  restoreReferenceBase();
});

async function modalActionFind() {
  if (step.value === 1) {
    formatIdentifier();
    await findReference();
  } else {
    saveReference();
  }
}

function modalCloseAction() {
  modalReferenceStore.reset();
  restoreReferenceBase();
}

function modalBackAction() {
  stepperRef.value.previous();
  restoreReferenceBase();
}

function saveReference() {
  if (!newReference.value.id) newReference.value.id = Date.now().toString();
  referenceStore.add(route.params.type as string, newReference.value);
  modalReferenceStore.reset();
  restoreReferenceBase();
}

function restoreReferenceBase() {
  const type = route.params.type as keyof typeof referencesTemplate;
  newReference.value = JSON.parse(JSON.stringify(referencesTemplate[type].template));
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
      newReference.value.id = identifier.value;
      if (isbnRegex.test(identifier.value)) {
        newReference.value = Object.assign(newReference.value, {
          title: result.items[0].volumeInfo.title,
          subtitle: result.items[0].volumeInfo.subtitle,
          authors: result.items[0].volumeInfo.authors,
          publisher: result.items[0].volumeInfo.publisher,
          ['published-date']: result.items[0].volumeInfo.publishedDate,
          pages: result.items[0].volumeInfo.pageCount,
          categories: result.items[0].volumeInfo.categories,
          URL: result.items[0].volumeInfo.infoLink,
          imageLinks: result.items[0].volumeInfo.imageLinks?.thumbnail,
          language: result.items[0].volumeInfo.language,
        });
      } else {
        formatArticleData(result.message);
      }
    }

    stepperRef?.value.next();
  } catch (error) {
    console.log(error);
    errorMessage.value = 'Reference not found';
  }
  isSearchingReference.value = false;
}

function formatIdentifier() {
  identifier.value = identifier.value.trim();
  const isbnFormattedRegex = /^(97(8|9))?[-\s]?\d{1,5}[-\s]?\d{1,7}[-\s]?\d{1,7}[-\s]?[\dX]$/i;

  if (isbnFormattedRegex.test(identifier.value)) {
    identifier.value = identifier.value.split('-').join('');
  }
}

function formatArticleData(article: RawArticle) {
  const author = article.author?.map((a) => a.family + ' ' + a.given);
  const { id, title, publisher, DOI, language, quotes, volume, issue, page, URL, type } = article;
  console.log(article);
  const publishedDate = article?.['published-print']?.['date-parts']?.[0]?.[0];
  newReference.value = Object.assign(newReference.value, {
    type,
    title,
    authors: author,
    journal: article['container-title'][0],
    publisher,
    ['published-date']: publishedDate,
    page,
    issue,
    volume,
    DOI,
    URL,
    language,
  });
}

async function handleDetectionComplete(payload: string) {
  identifier.value = payload;
  await findReference();
}
</script>

<style scoped></style>
