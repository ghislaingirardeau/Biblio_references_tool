<template>
  <q-btn
    v-if="user"
    size="sm"
    class="q-ml-sm text-white"
    :icon="mdiContentSave"
    round
    :loading="isSaving"
    @click="saveToFirestore"
  >
  </q-btn>
</template>

<script setup lang="ts">
import { mdiContentSave } from '@quasar/extras/mdi-v7';
import { storeToRefs } from 'pinia';
import { useAuth } from 'src/stores/auth';
import { saveDataFirestore } from 'src/utils/useFirestore';
import { ref } from 'vue';

const auth = useAuth();
const { user } = storeToRefs(auth);
const isSaving = ref(false);

async function saveToFirestore() {
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
