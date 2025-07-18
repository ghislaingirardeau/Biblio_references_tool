<template>
  <q-page class="p-2">
    <q-list v-if="references.books?.length" bordered separator>
      <q-item clickable v-ripple v-for="book in references.books" :key="book.id!">
        <q-item-section>
          <q-item-label>{{ book.title }}</q-item-label>
          <q-item-label caption>{{ book.authors![0] }}</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <div class="flex">
            <q-btn dense flat round icon="edit" />
            <q-btn dense flat round icon="delete" />
          </div>
        </q-item-section>
      </q-item> </q-list
  ></q-page>
</template>

<script setup lang="ts">
import { useReferencesStore } from 'src/stores/references';

const { references } = useReferencesStore();
</script>

<style scoped></style>
