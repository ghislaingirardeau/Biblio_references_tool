<template>
  <div class="flex q-gutter-y-sm" v-if="newQuote">
    <q-input class="w-full" filled v-model="newQuote.page" label="Page" />
    <q-input class="w-full" filled v-model="newQuote.content" type="textarea" label="Content" />
  </div>
</template>

<script setup lang="ts">
import type { Quote } from 'src/types/books';

const newQuote = defineModel<Quote>('newQuote');
</script>

<style scoped></style>
