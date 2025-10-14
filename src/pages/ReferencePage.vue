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
          <q-item-label>{{ typeReference.title }}</q-item-label>
          <q-item-label caption>
            <span
              v-for="(author, i) in typeReference.authors"
              :key="author.lastname + i"
              class="mr-2"
              >{{ author.lastname + ' ' + author.firstname }}</span
            >
          </q-item-label>
          <q-item-label v-if="typeReference.URL" class="italic underline">
            <span @click.stop="goToLink(typeReference.URL)">Check the reference website</span>
          </q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <div class="flex">
            <q-btn
              dense
              flat
              round
              color="primary"
              icon="edit"
              @click.stop="modalEdit(typeReference)"
            >
              <q-tooltip class="" :offset="[10, 10]"> Edit </q-tooltip>
            </q-btn>
            <q-btn
              dense
              flat
              round
              color="primary"
              icon="delete"
              @click.stop="modalConfirm(typeReference.id!)"
            >
              <q-tooltip class="" :offset="[10, 10]"> Remove </q-tooltip>
            </q-btn>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
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
import { storeToRefs } from 'pinia';
import AddWidget from 'src/components/AddWidget.vue';
import ConfirmModal from 'src/components/ConfirmModal.vue';
import EditModal from 'src/components/EditModal.vue';
import { useModalReferenceStore } from 'src/stores/modalReferences';
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

const selectedReference = ref<BibliographicEntry>({ id: null });
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
