<template>
  <q-dialog v-model="showEditModal!" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <EditBookForm
          v-if="$route.params.type === 'books'"
          v-model:editReference="selectedReference!"
        />
        <EditArticleFrom
          v-if="$route.params.type === 'articles'"
          v-model:editReference="selectedReference!"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" outline color="primary" v-close-popup />
        <q-btn flat label="Yes" color="primary" v-close-popup @click="emits('confirm-edit')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { Article, Book } from 'src/types/books';
import EditArticleFrom from './Edit/EditArticleFrom.vue';
import EditBookForm from './Edit/EditBookForm.vue';

const showEditModal = defineModel<boolean>('showEditModal');
const selectedReference = defineModel<Book | Article>('selectedReference');

const emits = defineEmits(['confirm-edit']);
</script>

<style scoped></style>
