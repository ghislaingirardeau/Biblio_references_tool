<template>
  <div class="flex q-gutter-y-sm" v-if="newReference">
    <q-input filled v-model="newReference.title" label="Title" />

    <div v-for="(author, index) in newReference.authors" :key="index" class="w-full">
      <q-input
        filled
        v-model="newReference.authors![index]"
        :label="'Author'.concat(': ' + (index + 1))"
      />
    </div>
    <q-input class="w-full" filled v-model="newReference.publisher" label="Publisher" />
    <q-input class="w-full" filled v-model="newReference.publishedDate" label="Published Date" />
    <q-input class="w-1/2" filled v-model="newReference.volume" label="Volume" />
    <q-input class="w-1/2" filled v-model="newReference.issue" label="Issue" />
    <q-input class="w-full" filled v-model="newReference.page" type="number" label="Pages" />
    <q-input
      class="w-full"
      filled
      type="url"
      v-model="newReference.URL"
      disable
      label="Info Link"
    />
  </div>
</template>

<script setup lang="ts">
import type { Article } from 'src/types/books';

const newReference = defineModel<Article>('newReference');
</script>

<style scoped></style>
