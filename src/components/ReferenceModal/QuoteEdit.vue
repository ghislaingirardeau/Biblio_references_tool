<template>
  <div class="flex q-gutter-y-sm" v-if="newQuote">
    <q-input class="w-full" filled v-model="newQuote.page" label="Page" />
    <!-- <q-input class="w-full" filled v-model="newQuote.content" type="textarea" label="Content" /> -->
    <QuillEditor
      v-model:content="newQuote.content"
      theme="snow"
      content-type="html"
      class="quill-editor w-full border-2 border-gray-200 !mt-0"
    />
  </div>
</template>

<script setup lang="ts">
import type { Quote } from 'src/types/books';

const newQuote = defineModel<Quote>('newQuote');
</script>

<style scoped></style>
