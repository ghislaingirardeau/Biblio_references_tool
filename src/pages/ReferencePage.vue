<template>
  <q-page class="p-2">
    <div v-if="typeReferences && typeReferences.length" class="row q-col-gutter-md q-pa-md">
      <div class="col-12 col-md-4" v-for="reference in typeReferences" :key="reference.id!">
        <q-card outlined class="full-height">
          <q-card-section @click="goToQuotes(reference.id!)" class="cursor-pointer">
            <div class="text-h6">{{ reference.title }}</div>
            <span
              v-for="(author, i) in reference.authors"
              :key="author.lastname + i"
              class="text-h7 underline"
            >
              {{ i === 0 ? 'by' : ',' }} {{ author.lastname + ' ' + author.firstname }}
            </span>
            <div class="italic my-2">
              Number of quotes: {{ reference.quotes?.length ? reference.quotes?.length : '0' }}
            </div>
            <div class="my-2">
              <q-chip
                v-for="tag in reference.tags"
                :key="tag"
                size="sm"
                outline
                square
                color="secondary"
                text-color="white"
                icon="bookmark"
              >
                {{ tag }}
              </q-chip>
            </div>
          </q-card-section>
          <q-card-actions class="border-t-2 border-indigo-500">
            <q-btn
              v-if="reference.URL"
              dense
              flat
              round
              color="primary"
              :icon="mdiWeb"
              @click.stop="goToLink(reference.URL)"
            >
              <q-tooltip class="" :offset="[10, 10]"> Website </q-tooltip>
            </q-btn>
            <q-btn dense flat round color="primary" icon="edit" @click.stop="modalEdit(reference)">
              <q-tooltip class="" :offset="[10, 10]"> Edit </q-tooltip>
            </q-btn>
            <q-btn
              dense
              flat
              round
              color="primary"
              icon="delete"
              @click.stop="modalConfirm(reference.id!)"
            >
              <q-tooltip class="" :offset="[10, 10]"> Remove </q-tooltip>
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <div v-else>No reference saved !</div>

    <AddWidget />

    <ConfirmModal v-model:showConfirmModal="showConfirmModal" @confirm="confirmDelete"
      ><template v-slot:message>
        Are you sure to delete this reference ? It will delete the quotes associated with !
      </template>
    </ConfirmModal>
    <EditModal
      v-model:showEditModal="showEditModal"
      v-model:selectedReference="selectedReference"
    />
  </q-page>
</template>

<script setup lang="ts">
import { mdiWeb } from '@quasar/extras/mdi-v7';
import AddWidget from 'src/components/AddWidget.vue';
import ConfirmModal from 'src/components/ConfirmModal.vue';
import EditModal from 'src/components/EditModal.vue';
import { useReferencesStore } from 'src/stores/references';
import type { BibliographicEntry } from 'src/types/references';
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

const selectedReference = ref<BibliographicEntry>({ id: null, title: '' });
const selectedId = ref<null | string>(null);

const typeReferences: ComputedRef<BibliographicEntry[]> = computed(() => {
  if (Array.isArray(ReferencesStore.filterReferences)) {
    return ReferencesStore.filterReferences as BibliographicEntry[];
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

function modalEdit(reference: BibliographicEntry) {
  showEditModal.value = true;
  selectedReference.value = reference;
}

async function confirmDelete() {
  await ReferencesStore.remove(type.value as string, selectedId.value!);
  selectedId.value = null;
}

// }
</script>

<style scoped></style>
