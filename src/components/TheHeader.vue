<template>
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>
      <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

      <!-- Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur dolorum repellendus ad nam optio. Eaque, impedit? Delectus officia quasi quam doloremque perferendis dolore totam voluptates, nesciunt vel amet, nostrum consequuntur? -->

      <q-toolbar-title @click="$router.go(-1)">
        {{ mainTitle }}
      </q-toolbar-title>
      <q-btn v-if="!isRouteHome" dense flat round icon="add" @click="openModal" />
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
const { capitalize } = format;

const route = useRoute();

const leftDrawerOpen = defineModel<boolean>('leftDrawerOpen');

const modalReferenceStore = useModalReferenceStore();
const ReferenceStore = useReferencesStore();
const { open } = storeToRefs(modalReferenceStore);

function openModal() {
  open.value = true;
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const isRouteHome = computed(() => {
  return route.name === 'references';
});

const mainTitle = computed(() => {
  if (isRouteHome.value) {
    return 'References';
  }
  if (route.params.id) {
    return ReferenceStore.getTitle(route.params.type as string, route.params.id as string);
  }
  return capitalize(route.params.type as string);
});
</script>

<style scoped></style>
