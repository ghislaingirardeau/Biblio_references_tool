<template>
  <div class="flex q-gutter-y-sm" v-if="editQuote">
    <q-input class="w-full" filled v-model="editQuote.page" label="Page" />
    <QuillEditor
      v-model:content="editQuote.content"
      theme="snow"
      content-type="html"
      class="quill-editor w-full border-2 border-gray-200 !mt-0"
    />
  </div>
</template>

<script setup lang="ts">
import type { Quote } from 'src/types/books';

const editQuote = defineModel<Quote>('editQuote');
</script>

<style scoped></style>
