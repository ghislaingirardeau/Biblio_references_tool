<template>
  <q-footer elevated class="flex flex-center">
    <q-toolbar class="my-2">
      <q-toolbar-title v-if="isRouteForReferences || isRouteQuotes">
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
            <q-icon :name="mdiCloseThick" @click="restore" color="primary" class="cursor-pointer" />
          </template>
        </q-input>
      </q-toolbar-title>
      <q-toolbar-title v-else> By Gg web dev </q-toolbar-title>
    </q-toolbar>
  </q-footer>
</template>

<script setup lang="ts">
import { mdiCloseThick } from '@quasar/extras/mdi-v7';
import { useQuotesStore } from 'src/stores/quotes';
import { useReferencesStore } from 'src/stores/references';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const ReferencesStore = useReferencesStore();
const QuotesStore = useQuotesStore();

const route = useRoute();
const query = ref('');
const isLoading = ref(false);
const message = ref<null | string | undefined>(null);

const isRouteForReferences = computed(() => {
  return !!route.params.type;
});

const isRouteQuotes = computed(() => {
  return !!route.params.id;
});

function filter() {
  isLoading.value = true;
  typeToFilter();
  isLoading.value = false;
}

function restore() {
  query.value = '';
  typeToFilter();
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
  () => {
    query.value = '';
  },
  { deep: true },
);
</script>

<style scoped></style>
