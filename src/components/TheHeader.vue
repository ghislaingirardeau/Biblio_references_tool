<template>
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>
      <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

      <q-toolbar-title class="cursor-pointer" @click="route.path !== '/' ? $router.go(-1) : null">
        {{ mainTitle }}
      </q-toolbar-title>

      <!-- <q-btn v-else dense flat round icon="restore" @click="ProjectsStore.resetProjects()" /> -->

      <SaveWidget />
      <AuthentificationWidget />
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { format } from 'quasar';
import { useModalReferenceStore } from 'src/stores/modalReferences';
import { storeToRefs } from 'pinia';
import { useReferencesStore } from 'src/stores/references';
import { useProjectsStore } from 'src/stores/projects';
import AuthentificationWidget from './AuthentificationWidget.vue';
import SaveWidget from './SaveWidget.vue';
import type { References } from 'src/types/references';
const { capitalize } = format;

const route = useRoute();

const leftDrawerOpen = defineModel<boolean>('leftDrawerOpen');

const modalReferenceStore = useModalReferenceStore();
const ReferenceStore = useReferencesStore();
const { open } = storeToRefs(modalReferenceStore);

const ProjectsStore = useProjectsStore();
const { project } = storeToRefs(ProjectsStore);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const mainTitle = computed(() => {
  let title = capitalize(project.value!.label).concat(` - ${capitalize(route.name as string)}`);

  if (route.params.type) {
    title = capitalize(project.value!.label).concat(
      ` - ${project.value!.references[route.params.type as keyof References]!.label}`,
    );
  }
  if (route.params.id) {
    title = title.concat(
      ` - ${ReferenceStore.getTitle(route.params.type as string, route.params.id as string)}`,
    );
  }
  return title;
});
</script>

<style scoped></style>
