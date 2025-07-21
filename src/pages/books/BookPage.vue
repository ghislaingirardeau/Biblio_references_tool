<template>
  <q-page class="p-2">
    <q-list v-if="quotes && quotes.length" bordered separator>
      <q-item clickable v-ripple v-for="quote in quotes" :key="quote.id!">
        <q-item-section>
          <q-item-label>{{ quote.content }}</q-item-label>
          <q-item-label caption>pages: {{ quote.page }}</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <div class="flex">
            <q-btn dense flat round icon="edit" />
            <q-btn dense flat round icon="delete" @click="deleteQuote(quote.id!)" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup lang="ts">
import { useReferencesStore } from 'src/stores/references';
import type { Quote } from 'src/types/books';
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const ReferencesStore = useReferencesStore();

const route = useRoute();

const quotes = computed(() => {
  if (Array.isArray(ReferencesStore.filteredQuotes)) {
    return ReferencesStore.filteredQuotes as Quote[];
  }
  return ReferencesStore.quotes ?? [];
});

function deleteQuote(id: string) {
  console.log('delete quote');
}

onMounted(() => {
  const type = (route.name as string).split('-')[0] as string;
  ReferencesStore.findQuotes(type, route.params.id as string);
});
</script>

<style scoped></style>
