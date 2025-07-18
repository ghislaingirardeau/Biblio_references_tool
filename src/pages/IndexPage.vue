<template>
  <q-page class="p-2">
    <pre>
      {{ references }}
    </pre>
  </q-page>
</template>

<script setup lang="ts">
import { useReferencesStore } from 'src/stores/references';
import { ref } from 'vue';

const { references } = useReferencesStore();
</script>
