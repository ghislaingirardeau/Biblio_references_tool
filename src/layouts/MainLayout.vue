<template>
  <q-layout view="hHh lpR fFf" :key="refreshKey">
    <TheHeader v-model:leftDrawerOpen="leftDrawerOpen" />

    <TheDrawer
      v-model:leftDrawerOpen="leftDrawerOpen"
      v-model:showConfirmModal="showConfirmModal"
      v-model:selectedFolder="selectedFolder"
    />

    <q-page-container>
      <BreadCrumbWidget v-if="route.params.type" />
      <router-view />
    </q-page-container>

    <TheFooter />

    <ReferenceModal :modalMode="modalMode" />

    <ConfirmModal v-model:showConfirmModal="showConfirmModal" @confirm="deleteProject"
      ><template v-slot:message> Are you sure to delete this project ? </template>
    </ConfirmModal>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import TheFooter from 'src/components/TheFooter.vue';
import TheHeader from 'src/components/TheHeader.vue';
import ReferenceModal from 'src/components/ReferenceModal.vue';
import { useRoute } from 'vue-router';
import { useProjectsStore } from 'src/stores/projects';

import { storeToRefs } from 'pinia';
import ConfirmModal from 'src/components/ConfirmModal.vue';
import BreadCrumbWidget from 'src/components/BreadCrumbWidget.vue';
import TheDrawer from 'src/components/TheDrawer.vue';
import { useReferencesStore } from 'src/stores/references';

const ProjectsStore = useProjectsStore();
const { refreshKey, projectId } = storeToRefs(ProjectsStore);

const ReferencesStore = useReferencesStore();

const showConfirmModal = ref(false);
const selectedFolder = ref<string | null>(null);
const leftDrawerOpen = ref(false);

const route = useRoute();

const modalMode = computed(() => {
  return route.params?.id ? 'quote' : 'reference';
});

async function deleteProject() {
  if (selectedFolder.value) {
    await ProjectsStore.remove(selectedFolder.value);
  }
  selectedFolder.value = null;
}

// onMounted(async () => {
//   if (projectId.value) {
//     await Promise.all([
//       ReferencesStore.loadReferences(),
//       // quotesStore.loadQuotes(projectStore.currentProjectId)
//     ]);
//   }
// });
</script>

<style lang="scss" scoped></style>
