<template>
  <q-page padding>
    <!-- <p v-if="!user">Loading references...</p>
    <q-card
      v-else
      class="col-sm-4 col-12 cursor-pointer"
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
    </q-card> -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8">
        <q-card outlined class="full-height">
          <TreeProjectView />
        </q-card>
      </div>
      <div class="col-12 col-md-4">
        <q-card class="bg-primary full-height" outlined>sdcsdv </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import TreeProjectView from 'src/components/Pdf/TreeProjectView.vue';
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
  console.log(type);
  await router.push({ name: 'references-type', params: { type } });
}
</script>
