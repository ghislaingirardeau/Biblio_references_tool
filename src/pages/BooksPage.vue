<template>
  <q-page class="p-2">
    <q-list v-if="ReferencesStore.references.books?.length" bordered separator>
      <q-item clickable v-ripple v-for="book in ReferencesStore.references.books" :key="book.id!">
        <q-item-section @click="goToBook(book.id!)">
          <q-item-label>{{ book.title }} {{ book.id }}</q-item-label>
          <q-item-label caption>{{ book.authors![0] }}</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <div class="flex">
            <q-btn dense flat round icon="edit" />
            <q-btn dense flat round icon="delete" @click="deleteBook(book.id!)" />
          </div>
        </q-item-section>
      </q-item> </q-list
  ></q-page>
</template>

<script setup lang="ts">
import { useReferencesStore } from 'src/stores/references';
import { useRouter } from 'vue-router';

const ReferencesStore = useReferencesStore();
const router = useRouter();

async function goToBook(id: string) {
  await router.push({ name: 'books-id', params: { id } });
}

function deleteBook(id: string) {
  ReferencesStore.remove('books', id);
}
</script>

<style scoped></style>
