<template>
  <q-page class="p-2 flex q-gutter-y-sm">
    <p v-if="!user">Loading references...</p>
    <q-card
      v-else
      class="w-full h-24 cursor-pointer"
      v-for="referenceType in menuTypes"
      :key="referenceType.type"
      @click="goTo(referenceType.type)"
    >
      <q-card-section>
        <div class="text-h6">{{ referenceType.label }}</div>
        <div class="text-subtitle2">
          {{ referenceType.description }} Total refs: {{ referenceType.countRef }}
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAuth } from 'src/stores/auth';
import { useReferencesStore } from 'src/stores/references';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const ReferencesStore = useReferencesStore();
const { references } = storeToRefs(ReferencesStore);
const auth = useAuth();
const { user } = storeToRefs(auth);

const menuTypes = computed(() => {
  const formatForMenu = Object.values(references.value)?.map((ref) => ({
    ...ref,
    countRef: ref.lists.length,
  }));
  formatForMenu.sort((a, b) => b.countRef - a.countRef);
  return formatForMenu;
});

const router = useRouter();

async function goTo(type: string) {
  await router.push({ name: 'references-type', params: { type } });
}
</script>
