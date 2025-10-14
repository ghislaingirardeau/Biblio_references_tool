<template>
  <q-btn
    v-if="user"
    size="sm"
    class="q-ml-sm text-white"
    :icon="mdiContentSave"
    round
    :loading="isSaving"
    @click="saveData"
  >
    <q-badge v-if="userHasToSave" color="red" floating>!</q-badge>
    <q-tooltip class="" :offset="[10, 10]"> Save </q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import { mdiContentSave } from '@quasar/extras/mdi-v7';
import { storeToRefs } from 'pinia';
import { useAuth } from 'src/stores/auth';
import { useProjectsStore } from 'src/stores/projects';
import { saveDataFirestore } from 'src/utils/useFirestore';
import { ref } from 'vue';

const auth = useAuth();
const { user } = storeToRefs(auth);
const ProjectsStore = useProjectsStore();
const { userHasToSave } = storeToRefs(ProjectsStore);

const isSaving = ref(false);

async function saveData() {
  try {
    isSaving.value = true;
    await saveDataFirestore();
  } catch (error) {
    console.log(error);
  }
  isSaving.value = false;
}
</script>

<style scoped></style>
