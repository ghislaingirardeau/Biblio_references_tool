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
      <div class="col-12" v-if="resultTagFilter.tag">
        <span class="text-h6 underline">References with "{{ resultTagFilter.tag }}" tags :</span>
        <q-card
          v-for="referenceFound in resultTagFilter.list"
          :key="referenceFound.id!"
          outlined
          class="p-2 m-2 cursor-pointer hover:bg-slate-200"
          @click="goToReference(referenceFound)"
        >
          <q-card-section v-if="'title' in referenceFound">
            {{ referenceFound.title }}
          </q-card-section>
          <q-card-section v-if="'content' in referenceFound">
            <span v-html="referenceFound.content"></span>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import TreeTagsView from 'src/components/TreeTagsView.vue';
import { useTagsStore } from 'src/stores/tags';
import type { BibliographicEntry, Quote } from 'src/types/references';
import { useRouter } from 'vue-router';

const tagsStore = useTagsStore();
const { treeReferencesTags, treeQuotesTags, resultTagFilter } = storeToRefs(tagsStore);

const router = useRouter();

async function goToReference(reference: BibliographicEntry | Quote) {
  const isQuote = 'reference_id' in reference;
  const referenceId = isQuote ? reference.reference_id : reference.id;
  const referenceType = isQuote ? reference.fromType : reference.type;

  await router.push({
    name: 'quotes-id',
    params: { type: referenceType as string, id: referenceId },
  });
}
</script>

<style scoped></style>
