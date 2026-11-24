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
import type { WebReferencePayload } from 'src/types/API';
import { isElectron } from 'src/utils/useElectron';

const ProjectsStore = useProjectsStore();
const { refreshKey } = storeToRefs(ProjectsStore);

const leftDrawerOpen = ref(false);

const route = useRoute();

const modalMode = computed(() => {
  return route.params?.id ? 'quote' : 'reference';
});

// ==========================================
// LISTEN TO CHROME EXTENSION TO ADD WEB REF TO ELECTRON
onMounted(() => {
  if (isElectron) {
    const subscribeToWebReferenceImport = window.electronAPI.onImportWebReference as unknown as (
      callback: (payload: WebReferencePayload) => void,
    ) => void;

    subscribeToWebReferenceImport((payload) => {
      console.log('Référence reçue depuis Chrome :', payload);

      // Appeler ici ta fonction du store
    });
  }
});
</script>

<style lang="scss" scoped></style>
