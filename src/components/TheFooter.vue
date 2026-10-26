<template>
  <q-footer elevated class="flex flex-center">
    <q-toolbar class="my-2">
      <q-toolbar-title v-if="isRouteForReferences || isRouteQuotes" class="flex items-center">
        <q-input
          square
          filled
          v-model="query"
          class="sm:w-1/3"
          :placeholder="`Filter ${isRouteQuotes ? 'quotes by content or tag' : 'by title, author or tag'}`"
          :label="`Filter ${isRouteQuotes ? 'quotes by content or tag' : 'by title, author or tag'}`"
          :loading="isLoading"
          color="primary"
          bg-color="white"
          :disable="isLoading"
          @keyup.enter="filter"
        >
          <template v-slot:append>
            <q-icon name="search" @click="filter" color="primary" class="cursor-pointer" />
            <q-icon :name="mdiCloseThick" @click="clear" color="primary" class="cursor-pointer" />
          </template>
        </q-input>
        <span class="ml-2">{{ message }}</span>
      </q-toolbar-title>

      <q-toolbar-title v-else> By Gg web dev </q-toolbar-title>
    </q-toolbar>
  </q-footer>
</template>

<script setup lang="ts">
import { mdiCloseThick } from '@quasar/extras/mdi-v7';
import { storeToRefs } from 'pinia';
import { useQuotesStore } from 'src/stores/quotes';
import { useReferencesStore } from 'src/stores/references';
import { useSearchStore } from 'src/stores/search';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const ReferencesStore = useReferencesStore();
const QuotesStore = useQuotesStore();
const SearchStore = useSearchStore();
const { query, message } = storeToRefs(SearchStore);

const route = useRoute();
const isLoading = ref(false);

const isRouteForReferences = computed(() => {
  return !!route.params.type;
});

const isRouteQuotes = computed(() => {
  return !!route.params.id;
});

async function clear() {
  await SearchStore.restore();
  typeToFilter();
}

function filter() {
  isLoading.value = true;
  typeToFilter();
  isLoading.value = false;
}

function typeToFilter() {
  message.value = null;
  if (isRouteQuotes.value) {
    filterQuotes();
  } else {
    filterReferences();
  }
}

function filterReferences() {
  message.value = ReferencesStore.filter(route.params.type as string, query.value);
}

function filterQuotes() {
  message.value = QuotesStore.filterQuotes(query.value);
}

watch(
  () => route,
  (after, before) => {
    if (after.name === 'quotes-id' || after.name === 'references-type') {
      if (route.query.id) {
        query.value = route.query.id as string;
        return;
      }
      query.value = '';
      message.value = null;
    }
  },
  { deep: true },
);
</script>

<style scoped></style>
