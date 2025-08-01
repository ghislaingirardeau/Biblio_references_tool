<template>
  <q-page class="p-2">
    <q-list v-if="typeReferences && typeReferences.length" bordered separator>
      <q-item
        clickable
        @click="goToQuotes(typeReference.id!)"
        v-ripple
        v-for="typeReference in typeReferences"
        :key="typeReference.id!"
      >
        <q-item-section>
          <q-item-label>{{ typeReference.title }} {{ typeReference.id }}</q-item-label>
          <q-item-label caption>
            <span v-for="author in typeReference.authors" :key="author" class="mr-2">{{
              author
            }}</span>
          </q-item-label>
          <q-item-label v-if="typeReference.URL" class="italic underline">
            <span @click.stop="goToLink(typeReference.URL)">Check the reference website</span>
          </q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <div class="flex">
            <q-btn dense flat round icon="edit" @click="modalEdit(typeReference)" />
            <q-btn dense flat round icon="delete" @click="modalConfirm(typeReference.id!)" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
    <ConfirmModal v-model:showConfirmModal="showConfirmModal" @confirm-delete="confirmDelete" />
    <EditModal
      v-model:showEditModal="showEditModal"
      v-model:selectedReference="selectedReference"
    />
  </q-page>
</template>

<script setup lang="ts">
import ConfirmModal from 'src/components/ConfirmModal.vue';
import EditModal from 'src/components/EditModal.vue';
import { useReferencesStore } from 'src/stores/references';
import type { Article, Book } from 'src/types/books';
import type { References } from 'src/types/references';
import { computed, ref } from 'vue';
import type { ComputedRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const ReferencesStore = useReferencesStore();
const router = useRouter();
const route = useRoute();

const type = computed(() => route.params.type);

const showConfirmModal = ref(false);
const showEditModal = ref(false);

const selectedReference = ref<Book | Article>({ id: null });
const selectedId = ref<null | string>(null);

const typeReferences: ComputedRef<Book[] | Article[]> = computed(() => {
  if (Array.isArray(ReferencesStore.filterReferences)) {
    return ReferencesStore.filterReferences as Book[] | Article[];
  }
  return ReferencesStore.references[type.value as keyof References]?.lists ?? [];
});

async function goToQuotes(id: string) {
  await router.push({ name: 'quotes-id', params: { type: type.value, id } });
}

function goToLink(link: string) {
  window.open(link, '_blank');
}

function modalConfirm(id: string) {
  showConfirmModal.value = true;
  selectedId.value = id;
}

function modalEdit(reference: Article | Book) {
  showEditModal.value = true;
  selectedReference.value = reference;
}

function confirmDelete() {
  ReferencesStore.remove(type.value as string, selectedId.value!);
  selectedId.value = null;
}

// }
</script>

<style scoped></style>
