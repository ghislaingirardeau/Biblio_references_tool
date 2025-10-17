<template>
  <q-page class="p-6 flex flex-col flex-center q-gutter-y-sm">
    <div>
      <h1 class="text-4xl my-4 text-center underline">What is it ?</h1>
      <h2 class="text-2xl my-4 text-center underline">
        Organise your quotes inside its references
      </h2>
      <ul class="list-disc">
        <li class="my-2">
          Organise your references with many types availables: book, journal article, website...
        </li>
        <li class="my-2">Find a reference by ISBN or DOI if exist or type the reference</li>
        <li class="my-2">Edit the reference</li>
        <li class="my-2">Add a quote inside the reference</li>
        <li class="my-2">Add tag with key word to filter references or quotes faster</li>
        <li class="my-2">Generate your bibliography with different style</li>
      </ul>
      <h2 class="text-2xl my-4 text-center underline">
        Fast way to find reference & extract a quote !
      </h2>
      <ul class="list-disc">
        <li class="my-2">Scan reference barcode to find it</li>
        <li class="my-2">Take a picture of the text you want to extract the text</li>
        <li class="my-2">Crop the text</li>
        <li class="my-2">That's it ! The quote is extract, you can edit, add a page and a tag</li>
      </ul>
    </div>
    <h2 class="text-2xl my-4 text-center">Sign-in to start using the tool</h2>
    <div>
      <q-btn
        color="primary"
        label="Sign-in with Google"
        @click="useFirebaseAuth.signInWithGoogle()"
      >
      </q-btn>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useFirebaseAuth } from 'src/utils/useFirebaseAuth';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<style scoped></style>
