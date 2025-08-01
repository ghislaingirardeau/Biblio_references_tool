<template>
  <q-footer elevated class="bg-grey-8 text-white">
    <q-toolbar>
      <q-toolbar-title v-if="isRouteForReferences || isRouteQuotes">
        <q-input
          square
          filled
          v-model="query"
          :placeholder="`Filter by ${isRouteQuotes ? 'quotes content' : 'title, author or tag'}`"
          :loading="isLoading"
          :disable="isLoading"
          @keyup.enter="filter"
        >
          <template v-slot:append>
            <q-icon name="search" @click="filter" color="primary" />
          </template>
        </q-input>
      </q-toolbar-title>
      <q-toolbar-title v-else> By Gg web dev </q-toolbar-title>
    </q-toolbar>
  </q-footer>
</template>

<script setup lang="ts">
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
  message.value = null;
  if (isRouteQuotes.value) {
    filterQuotes();
  } else {
    filterReferences();
  }
  isLoading.value = false;
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
