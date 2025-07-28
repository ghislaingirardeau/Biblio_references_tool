<template>
  <q-page class="p-2 flex q-gutter-y-sm">
    <q-card
      class="w-full h-24"
      v-for="referenceType in menuTypes"
      :key="referenceType.label"
      @click="goTo(referenceType.label)"
    >
      <q-card-section>
        <div class="text-h6">{{ referenceType.label }}</div>
        <div class="text-subtitle2">
          {{ referenceType.description }} Total refs: {{ referenceType.countRef }}
        </div>
      </q-card-section>
    </q-card></q-page
  >
</template>

<script setup lang="ts">
import { useReferencesStore } from 'src/stores/references';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const { references } = useReferencesStore();

const menuTypes = computed(() => {
  const formatForMenu = Object.values(references).map((ref) => ({
    ...ref,
    countRef: ref.lists.length,
  }));
  return formatForMenu;
});

const router = useRouter();

async function goTo(type: string) {
  await router.push({ name: 'references-type', params: { type } });
}
</script>
