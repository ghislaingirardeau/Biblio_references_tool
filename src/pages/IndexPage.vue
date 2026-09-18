<template>
  <q-page padding>
    <div class="row q-col-gutter-md q-pa-md">
      <div class="col-12 col-md-8">
        <q-card outlined class="full-height p-2">
          <TreeProjectView />
        </q-card>
      </div>
      <div class="col-12 col-md-4">
        <q-card outlined class="full-height p-2">Tutorial d'aide et explications ici</q-card>
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
