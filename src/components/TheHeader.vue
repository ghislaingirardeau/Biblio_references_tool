<template>
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>
      <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

      <q-toolbar-title @click="$router.push('/')">
        {{ mainTitle }}
      </q-toolbar-title>
      <q-btn v-if="isRouteReferences" dense flat round icon="add" @click="openModal" />
      <q-btn v-else dense flat round icon="restore" @click="ReferenceStore.resetReferences()" />
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

const isRouteReferences = computed(() => {
  return !!route.params.type;
});

const mainTitle = computed(() => {
  if (route.params.id) {
    return ReferenceStore.getTitle(route.params.type as string, route.params.id as string);
  }
  if (route.params.type) {
    return capitalize(route.params.type as string);
  }
  return capitalize(route.name as string);
});
</script>

<style scoped></style>
