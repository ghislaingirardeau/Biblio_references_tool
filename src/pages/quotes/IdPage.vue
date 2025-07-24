<template>
  <q-page class="p-2">
    <q-list v-if="quotes && quotes.length" bordered separator>
      <q-item clickable v-ripple v-for="quote in quotes" :key="quote.id!">
        <q-item-section>
          <q-item-label> <div class="truncate-2-lines" v-html="quote.content"></div></q-item-label>
          <q-item-label caption>pages: {{ quote.page }}</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <div class="flex">
            <q-btn dense flat round icon="edit" @click="modalEdit(quote)" />
            <q-btn dense flat round icon="delete" @click="deleteQuote(quote.id!)" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
    <EditModal
      v-model:showEditModal="showEditModal"
      v-model:selectedReference="selectedQuote as Quote"
      @confirm-edit="confirmEdit"
    />
  </q-page>
</template>

<script setup lang="ts">
import EditModal from 'src/components/EditModal.vue';
import { useReferencesStore } from 'src/stores/references';
import type { Quote } from 'src/types/books';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const ReferencesStore = useReferencesStore();

const route = useRoute();
const showEditModal = ref(false);
const selectedQuote = ref<Quote | null>(null);

const quotes = computed(() => {
  if (Array.isArray(ReferencesStore.filteredQuotes)) {
    return ReferencesStore.filteredQuotes as Quote[];
  }
  return ReferencesStore.quotes ?? [];
});

function deleteQuote(id: string) {
  console.log('delete quote');
}

function modalEdit(quote: Quote) {
  showEditModal.value = true;
  selectedQuote.value = quote;
}

function confirmEdit() {
  console.log('update store quote');
  selectedQuote.value = null;
}

onMounted(() => {
  ReferencesStore.findQuotes(route.params.type as string, route.params.id as string);
});
</script>

<style scoped>
.truncate-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 3em; /* Adjust based on line-height */
}
</style>
