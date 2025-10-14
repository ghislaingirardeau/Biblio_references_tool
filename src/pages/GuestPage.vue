<template>
  <q-page class="p-2 flex flex-col flex-center q-gutter-y-sm">
    <div>
      <ul>
        <li>Organise your references by projects</li>
        <li>Find a reference and save it</li>
        <li>Custom reference</li>
        <li>Add quote by reference: copy text or take a picture</li>
        <li>Add tag on reference or quote to find it easely</li>
        <li>Generate your bibliography</li>
      </ul>
    </div>
    <div>Sign-in to start using the tool</div>
    <div>
      <q-btn color="primary" label="Sign-in" @click="useFirebaseAuth.signInWithGoogle()"> </q-btn>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useFirebaseAuth } from 'src/utils/useFirebaseAuth';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<style scoped></style>
