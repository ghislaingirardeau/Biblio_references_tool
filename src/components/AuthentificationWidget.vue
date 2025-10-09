<template>
  <div>
    <q-btn
      v-if="loggedIn"
      size="sm"
      round
      :icon="mdiLogout"
      class="q-ml-sm text-white"
      @click="useFirebaseAuth.logout(router)"
    >
    </q-btn>
    <q-btn
      v-else
      size="sm"
      round
      :icon="mdiAccountPlus"
      class="q-ml-sm text-white"
      @click="useFirebaseAuth.signInWithGoogle(router)"
    >
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { mdiAccountPlus, mdiLogout } from '@quasar/extras/mdi-v7';
import { storeToRefs } from 'pinia';
import { useAuth } from 'src/stores/auth';
import { useFirebaseAuth } from 'src/utils/useFirebaseAuth';
import { useRouter } from 'vue-router';

const auth = useAuth();
const { loggedIn } = storeToRefs(auth);

const router = useRouter();
</script>

<style scoped></style>
