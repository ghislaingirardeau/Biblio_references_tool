<template>
  <q-layout view="hHh lpR fFf" :key="refreshKey">
    <TheHeader v-model:leftDrawerOpen="leftDrawerOpen" />

    <TheDrawer v-model:leftDrawerOpen="leftDrawerOpen" />

    <q-page-container>
      <BreadCrumbWidget v-if="route.params.type" />
      <router-view />
    </q-page-container>

    <TheFooter />

    <ReferenceModal :modalMode="modalMode" />
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
import BreadCrumbWidget from 'src/components/BreadCrumbWidget.vue';
import TheDrawer from 'src/components/TheDrawer.vue';

const ProjectsStore = useProjectsStore();
const { refreshKey } = storeToRefs(ProjectsStore);

const leftDrawerOpen = ref(false);

const route = useRoute();

const modalMode = computed(() => {
  return route.params?.id ? 'quote' : 'reference';
});

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
