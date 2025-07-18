<template>
  <q-stepper v-model="step" ref="stepperRef" color="primary" animated>
    <q-step :name="1" title="Book" icon="settings" :done="step > 1" class="text-black">
      <q-input
        filled
        v-model="identifier"
        label="Reference Identifier (ISBN or DOI)"
        placeholder="976-xxxxx"
      />
    </q-step>

    <q-step :name="2" title="Edit" icon="create_new_folder" :done="step > 2" class="text-black">
      <div class="flex q-gutter-y-sm">
        <q-input class="w-full" filled v-model="newReference.title" label="Title" />

        <div v-for="(author, index) in newReference.authors" :key="index" class="w-full">
          <q-input
            filled
            v-model="newReference.authors![index]"
            :label="'Author'.concat(': ' + (index + 1))"
          />
        </div>
        <q-input class="w-full" filled v-model="newReference.subtitle" label="Subtitle" />
        <q-input class="w-full" filled v-model="newReference.publisher" label="Publisher" />
        <q-input
          class="w-full"
          filled
          v-model="newReference.publishedDate"
          label="Published Date"
        />
        <q-input
          class="w-full"
          filled
          v-model="newReference.pageCount"
          type="number"
          label="Pages"
        />
        <q-input
          class="w-full"
          filled
          type="url"
          v-model="newReference.infoLink"
          disable
          label="Info Link"
        />
      </div>
    </q-step>

    <template v-slot:navigation>
      <q-stepper-navigation>
        <q-btn
          @click="modalAction"
          :loading="isSearchingReference"
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
import type { Book } from 'src/types/books';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const step = ref(1);
const stepperRef = ref();

const identifier = ref('0299326101');
const isSearchingReference = ref(false);

const newReference = ref<Book>({ id: null });

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
  console.log(route.name);
  referenceStore.add(route.name as string, newReference.value);
  modalReferenceStore.reset();
}

async function findReference() {
  try {
    isSearchingReference.value = true;

    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(identifier.value)}&maxResults=1`,
    );
    if (response.ok) {
      const result = await response.json();
      console.log(result.items[0].volumeInfo);
      const referenceFound = result.items[0].volumeInfo as Book;
      referenceFound.id = Number(referenceFound.industryIdentifiers![0]!.identifier);
      newReference.value = referenceFound;
      stepperRef?.value.next();
    }
  } catch (error) {
    console.log(error);
  }
  isSearchingReference.value = false;
}
</script>

<style scoped></style>
