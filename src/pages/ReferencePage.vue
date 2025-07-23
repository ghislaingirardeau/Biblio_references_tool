<template>
  <q-page class="p-2">
    <q-list v-if="typeReferences && typeReferences.length" bordered separator>
      <q-item clickable v-ripple v-for="typeReference in typeReferences" :key="typeReference.id!">
        <q-item-section @click="goToQuotes(typeReference.id!)">
          <q-item-label>{{ typeReference.title }} {{ typeReference.id }}</q-item-label>
          <q-item-label caption>{{ typeReference.authors![0] }}</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <div class="flex">
            <q-btn dense flat round icon="edit" />
            <q-btn dense flat round icon="delete" @click="deleteReference(typeReference.id!)" />
          </div>
        </q-item-section>
      </q-item> </q-list
  ></q-page>
</template>

<script setup lang="ts">
import { useReferencesStore } from 'src/stores/references';
import type { Book } from 'src/types/books';
import type { References } from 'src/types/references';
import { computed } from 'vue';
import type { ComputedRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const ReferencesStore = useReferencesStore();
const router = useRouter();
const route = useRoute();

const type = computed(() => route.params.type);

const typeReferences: ComputedRef<Book[]> = computed(() => {
  if (Array.isArray(ReferencesStore.filterReferences)) {
    return ReferencesStore.filterReferences as Book[];
  }
  return ReferencesStore.references[type.value as keyof References] ?? [];
});

async function goToQuotes(id: string) {
  await router.push({ name: 'quotes-id', params: { type: type.value, id } });
}

function deleteReference(id: string) {
  ReferencesStore.remove(type.value as string, id);
}
</script>

<style scoped></style>
