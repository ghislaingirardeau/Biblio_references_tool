<template>
  <q-dialog v-model="showConfirmModal!" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <span class="q-ml-sm">
          <slot name="message"></slot>
        </span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="negative" v-close-popup />
        <q-btn flat label="Yes" color="negative" v-close-popup @click="emits('confirm')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
const showConfirmModal = defineModel<boolean>('showConfirmModal');

const emits = defineEmits(['confirm']);
</script>

<style scoped></style>
