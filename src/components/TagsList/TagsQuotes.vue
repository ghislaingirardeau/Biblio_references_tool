<template>
  <q-item v-for="(tag, index) in tagsQuote" :key="index">
    <q-item-section> {{ tag }} </q-item-section>
    <q-item-section side>
      <q-icon :name="mdiTrashCan" size="sm" color="negative" class="cursor-pointer" />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { mdiTrashCan } from '@quasar/extras/mdi-v7';
import { storeToRefs } from 'pinia';
import { useTagsStore } from 'src/stores/tags';

const TagsStore = useTagsStore();
const { tagsQuote } = storeToRefs(TagsStore);
</script>

<style scoped></style>
