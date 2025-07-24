<template>
  <q-dialog
    v-model="showEditModal!"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card>
      <q-card-section class="row items-center">
        <EditBookForm
          v-if="$route.params.type === 'books' && !$route.params.id"
          v-model:editReference="selectedReference!"
        />
        <EditArticleFrom
          v-if="$route.params.type === 'articles' && !$route.params.id"
          v-model:editReference="selectedReference!"
        />
        <QuoteEdit v-if="$route.params.id" v-model:editQuote="selectedReference! as Quote" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Close" outline color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { Article, Book, Quote } from 'src/types/books';
import EditArticleFrom from './Edit/EditArticleFrom.vue';
import EditBookForm from './Edit/EditBookForm.vue';
import QuoteEdit from './ReferenceModal/QuoteEdit.vue';

const showEditModal = defineModel<boolean>('showEditModal');
const selectedReference = defineModel<Book | Article | Quote>('selectedReference');
</script>

<style scoped></style>
