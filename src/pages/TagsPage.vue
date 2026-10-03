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
      <div class="col-12" v-if="referencesWithSpecificTag.tag">
        <span class="text-h6 underline"
          >References with "{{ referencesWithSpecificTag.tag }}" tags :</span
        >
        <q-card
          v-for="referenceFound in referencesWithSpecificTag.list"
          :key="referenceFound.id!"
          outlined
          class="p-2 m-2 cursor-pointer hover:bg-slate-200"
          @click="getModeForFileReference(referenceFound.type, referenceFound.id)"
        >
          {{ referenceFound.title }}</q-card
        >
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import TreeTagsView from 'src/components/TreeTagsView.vue';
import { useTagsStore } from 'src/stores/tags';
import { useRouter } from 'vue-router';

const tagsStore = useTagsStore();
const { treeReferencesTags, treeQuotesTags, referencesWithSpecificTag } = storeToRefs(tagsStore);

const router = useRouter();

async function getModeForFileReference(type: string, id: string | null) {
  await router.push({ name: 'quotes-id', params: { type: type, id } });
}
</script>

<style scoped></style>
