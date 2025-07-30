<template>
  <div class="flex q-gutter-y-sm" v-if="editReference">
    <q-input class="w-full" filled v-model="editReference.type" label="Type" />
    <q-input class="w-full" filled v-model="editReference.title" label="Title" />
    <q-input class="w-full" filled v-model="editReference.subtitle" label="Subtitle" />

    <div v-for="(author, index) in editReference.authors" :key="index" class="w-full">
      <q-input
        filled
        v-model="editReference.authors![index]"
        :label="'Author'.concat(': ' + (index + 1))"
      />
    </div>
    <q-input class="w-full" filled v-model="editReference.publisher" label="Publisher" />
    <q-input class="w-full" filled v-model="editReference.journal" label="Journal" />
    <q-input class="w-full" filled v-model="editReference.publishedDate" label="Published Date" />
    <q-input class="w-1/2" filled v-model="editReference.volume" label="Volume" />
    <q-input class="w-1/2" filled v-model="editReference.issue" label="Issue" />
    <q-input class="w-full" filled v-model="editReference.page" label="Pages" />
    <q-input
      class="w-full"
      filled
      type="url"
      v-model="editReference.URL"
      disable
      label="Info Link"
    />
  </div>
</template>

<script setup lang="ts">
import type { Article } from 'src/types/books';

const editReference = defineModel<Article>('editReference');
</script>

<style scoped></style>
