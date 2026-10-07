<template>
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>
      <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

      <q-toolbar-title>
        <q-spinner v-if="isFetchingData" color="white" size="1em" />

        <span v-else>
          {{ mainTitle }}
        </span>
      </q-toolbar-title>

      <!-- Reset datas and save to reset firestore as well -->
      <!-- <q-btn dense flat round icon="restore" @click="ProjectsStore.resetProjects()" /> -->

      <!-- <SyncWidget /> -->
      <SaveWidget />
      <AuthentificationWidget />
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { format } from 'quasar';
import { storeToRefs } from 'pinia';
import { useReferencesStore } from 'src/stores/references';
import { useAuth } from 'src/stores/auth';
import { useProjectsStore } from 'src/stores/projects';
import AuthentificationWidget from './AuthentificationWidget.vue';
import SaveWidget from './SaveWidget.vue';
import type { References } from 'src/types/references';
// import SyncWidget from './SyncWidget.vue';
const { capitalize } = format;

const route = useRoute();

const leftDrawerOpen = defineModel<boolean>('leftDrawerOpen');

const ReferenceStore = useReferencesStore();
const auth = useAuth();
const { isFetchingData } = storeToRefs(auth);
const ProjectsStore = useProjectsStore();
const { project } = storeToRefs(ProjectsStore);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const mainTitle = computed(() => {
  let title = null;

  if (project.value?.label && !isFetchingData.value) {
    title = capitalize(project.value.label).concat(` - ${capitalize(route.name as string)}`);
  }

  if (route.params.type) {
    title = project.value!.references[route.params.type as keyof References]!.label;
  }
  if (route.params.id) {
    title = ReferenceStore.getTitle(route.params.type as string, route.params.id as string)!;
  }
  return title;
});
</script>

<style scoped></style>
