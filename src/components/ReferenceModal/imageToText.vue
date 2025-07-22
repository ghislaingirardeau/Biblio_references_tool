<template>
  <div>
    <q-file v-model="file" label="Pick one file" filled style="max-width: 300px" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const file = ref(null);
</script>

<style scoped></style>
