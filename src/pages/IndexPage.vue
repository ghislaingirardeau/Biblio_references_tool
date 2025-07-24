<template>
  <q-page class="p-2 flex q-gutter-y-sm">
    <q-card
      class="w-full h-24"
      v-for="referenceType in menuTypes"
      :key="referenceType.label"
      @click="goTo(referenceType.label)"
    >
      <q-card-section>
        <div class="text-h6">{{ referenceType.label.toUpperCase() }}</div>
        <div class="text-subtitle2">Reference counted: {{ referenceType.countRef }}</div>
      </q-card-section>
    </q-card></q-page
  >
</template>

<script setup lang="ts">
import { useReferencesStore } from 'src/stores/references';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const { references, types } = useReferencesStore();

const menuTypes = computed(() => {
  return types.map((ref) => ({
    label: ref,
    countRef: references[ref]?.length,
  }));
});

const router = useRouter();

async function goTo(type: string) {
  await router.push({ name: 'references-type', params: { type } });
}
</script>
