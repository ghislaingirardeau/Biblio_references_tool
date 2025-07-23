<template>
  <q-dialog v-model="showConfirmModal!" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <span class="q-ml-sm"
          >Are you sure to delete this reference ? It will delete the quotes associated with !</span
        >
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="negative" v-close-popup />
        <q-btn flat label="Yes" color="negative" v-close-popup @click="emits('confirm-delete')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
const showConfirmModal = defineModel<boolean>('showConfirmModal');

const emits = defineEmits(['confirm-delete']);
</script>

<style scoped></style>
