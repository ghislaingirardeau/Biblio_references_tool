<template>
  <div class="q-pa-md q-gutter-sm">
    <q-breadcrumbs>
      <q-breadcrumbs-el
        v-for="link in navigationLinks"
        :key="link.label"
        :label="link.label === 'home' ? '' : link.label"
        :to="link.route"
        :icon="link.label === 'home' ? 'home' : undefined"
      />
    </q-breadcrumbs>
  </div>
</template>

<script setup lang="ts">
import { useReferencesStore } from 'src/stores/references';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { format } from 'quasar';
import type { TypeBreadCrumbLinks } from 'src/types/breadcrumbLinks';

const route = useRoute();
const ReferenceStore = useReferencesStore();
const { capitalize } = format;

const navigationLinks = computed(() => {
  const links = [
    {
      label: 'home',
      route: '/',
    },
  ] as TypeBreadCrumbLinks[];

  if (route.params.type) {
    links.push({
      label: capitalize(route.params.type as string),
      route: `/${route.params.type as string}`,
    });
  }
  if (route.params.id && route.params.type) {
    links.push({
      label: ReferenceStore.getTitle(route.params.type as string, route.params.id as string)!,
      route: route.params.id as string,
    });
  }
  return links;
});
</script>

<style scoped></style>
