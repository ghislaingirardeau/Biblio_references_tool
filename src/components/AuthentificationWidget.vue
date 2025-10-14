<template>
  <div>
    <q-btn
      v-if="loggedIn"
      size="sm"
      round
      :icon="mdiLogout"
      class="q-ml-sm text-white"
      @click="showConfirmModal = true"
    >
      <q-tooltip class="" :offset="[10, 10]"> Logout </q-tooltip>
    </q-btn>
    <q-btn
      v-else
      size="sm"
      round
      :icon="mdiAccountPlus"
      class="q-ml-sm text-white"
      @click="useFirebaseAuth.signInWithGoogle()"
    >
    </q-btn>
    <ConfirmModal
      v-model:showConfirmModal="showConfirmModal"
      @confirm="useFirebaseAuth.logout(router)"
      ><template v-slot:message>
        {{
          userHasToSave
            ? 'You have work not saved ! If you log out, you work will be lost'
            : 'Are you sure to log out ?'
        }}
      </template>
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
import { mdiAccountPlus, mdiLogout } from '@quasar/extras/mdi-v7';
import { storeToRefs } from 'pinia';
import { useAuth } from 'src/stores/auth';
import { useFirebaseAuth } from 'src/utils/useFirebaseAuth';
import { useRouter } from 'vue-router';
import ConfirmModal from './ConfirmModal.vue';
import { ref } from 'vue';
import { useProjectsStore } from 'src/stores/projects';

const auth = useAuth();
const { loggedIn } = storeToRefs(auth);

const router = useRouter();
const ProjectsStore = useProjectsStore();
const { userHasToSave } = storeToRefs(ProjectsStore);

const showConfirmModal = ref(false);
</script>

<style scoped></style>
