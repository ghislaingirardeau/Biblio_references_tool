<!-- pages/pdf-reader.vue -->
<template>
  <q-page padding>
    <!-- Injection sécurisée du lecteur -->
    <ClientOnly>
      <PdfIntegrator />
      <template #fallback>
        <div class="flex flex-center q-pa-xl">
          <q-spinner-dots size="40px" color="primary" />
          <span class="q-ml-sm text-grey-7">Chargement du module de lecture...</span>
        </div>
      </template>
    </ClientOnly>
  </q-page>
</template>

<script setup lang="ts">
import PdfIntegrator from 'src/components/Pdf/PdfIntegrator.vue';
</script>

<style scoped></style>
