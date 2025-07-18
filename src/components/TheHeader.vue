<template>
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>
      <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

      <q-toolbar-title @click="$router.push({ name: 'references' })">
        {{ mainTitle }}
      </q-toolbar-title>
      <q-space />
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
const { capitalize } = format;

const route = useRoute();

const leftDrawerOpen = defineModel<boolean>('leftDrawerOpen');

const modalReferenceStore = useModalReferenceStore();
const { open, isForQuote, isForReference } = storeToRefs(modalReferenceStore);

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
  } else {
    return capitalize(route.name as string);
  }
});
</script>

<style scoped></style>
