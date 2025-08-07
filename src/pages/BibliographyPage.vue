<template>
  <q-page class="p-2">
    my biblio display
    <q-select borderless v-model="selectedFormat" :options="formats" label="Format" class="w-24" />

    <div v-for="(referenceType, i) in project?.references" :key="i">
      <div v-if="referenceType?.lists.length">
        <div class="flex flex-center q-gutter-md">
          <span class="font-bold p-2">
            {{ referenceType!.type }}
          </span>
          <q-select
            borderless
            v-model="formatCitation.author"
            :options="['Uppercase', 'LowerCase']"
            label="Author"
            class="w-24"
          />
          <q-select
            borderless
            v-model="formatCitation.title"
            :options="['italic', 'bold']"
            label="Title"
            class="w-24"
          />
          <q-select
            borderless
            v-model="formatCitation.page"
            :options="['pp.', 'p.', 'pages']"
            label="Pages"
            class="w-24"
          />
        </div>

        <CitationsContainer
          :key="selectedFormat"
          :references="referenceType.lists"
          :referenceType="referenceType!.type"
          @modalEdit="modalEdit"
        />
      </div>
    </div>
    <EditModal
      v-model:showEditModal="showEditModal"
      v-model:selectedReference="selectedReference"
    />
  </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import CitationsContainer from 'src/components/bibliography/CitationsContainer.vue';
import EditModal from 'src/components/EditModal.vue';
import { useFormatReferenceStore } from 'src/stores/formatReference';
import { useProjectsStore } from 'src/stores/projects';
import type { BibliographicEntry } from 'src/types/references';

import { computed, ref } from 'vue';

const ProjectsStore = useProjectsStore();
const { project } = storeToRefs(ProjectsStore);

const FormatReferenceStore = useFormatReferenceStore();
const { selectedFormat, formats } = storeToRefs(FormatReferenceStore);

const formatCitation = ref({
  title: '',
  author: '',
  page: '',
});

const showEditModal = ref(false);
const selectedReference = ref<BibliographicEntry>({ id: null });

function modalEdit(reference: BibliographicEntry) {
  showEditModal.value = true;
  selectedReference.value = reference;
}
</script>

<style scoped></style>
