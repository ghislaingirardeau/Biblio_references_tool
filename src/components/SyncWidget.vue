<template>
  <q-btn
    v-if="user"
    size="sm"
    class="q-ml-sm text-white"
    :icon="mdiSync"
    round
    :loading="isSync"
    :disable="isSync"
    @click="syncData"
  >
    <q-tooltip class="" :offset="[10, 10]"> Sync data </q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import { mdiSync } from '@quasar/extras/mdi-v7';
import { storeToRefs } from 'pinia';
import { useAuth } from 'src/stores/auth';
import { useProjectsStore } from 'src/stores/projects';
import { setUserFirestore } from 'src/utils/useFirestore';
import { ref } from 'vue';

const auth = useAuth();
const { user } = storeToRefs(auth);

const ProjectsStore = useProjectsStore();
const { userHasToSave, refreshKey } = storeToRefs(ProjectsStore);

const isSync = ref(false);

async function syncData() {
  isSync.value = true;
  await setUserFirestore();
  isSync.value = false;
  userHasToSave.value = false;
  refreshKey.value++;
}
</script>

<style scoped></style>
