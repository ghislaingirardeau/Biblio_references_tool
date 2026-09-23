<template>
  <q-btn label="Lire le clipboard" @click="test" />
</template>

<script setup lang="ts">
import { useDesktop } from 'src/utils/useElectron';

const { isElectron, readClipboard } = useDesktop();

const test = async () => {
  const text = await readClipboard();

  console.log(text);
};
</script>

<style scoped></style>
