<template>
  <q-page padding>
    <div class="row q-col-gutter-md q-pa-md">
      <div class="col-12 col-md-4">
        <q-card outlined class="full-height p-2">
          <tree-tags-view :treeTags="treeReferencesTags" type="references" />
        </q-card>
      </div>
      <div class="col-12 col-md-4">
        <q-card outlined class="full-height p-2">
          <tree-tags-view :treeTags="treeQuotesTags" type="quotes" />
        </q-card>
      </div>
      <div class="col-12 col-md-4">
        <q-card outlined class="full-height p-2">Tutorial d'aide et explications ici</q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import TreeTagsView from 'src/components/TreeTagsView.vue';
import { useTagsStore } from 'src/stores/tags';

const tagsStore = useTagsStore();
const { treeReferencesTags, treeQuotesTags } = storeToRefs(tagsStore);
</script>

<style scoped></style>
