```vue
<template>
  <q-card class="q-pa-md" style="max-width: 800px; margin: auto">
    <q-card-section>
      <div class="text-h6">Test OCR avec Tesseract.js</div>
      <div class="text-caption text-grey">Sélectionne une photo contenant du texte</div>
    </q-card-section>

    <q-card-section>
      <q-file
        v-model="imageFile"
        label="Choisir une image"
        accept="image/*"
        outlined
        clearable
        @update:model-value="processImage"
      />
    </q-card-section>

    <!-- Aperçu -->
    <q-card-section v-if="imageUrl">
      <div class="text-subtitle2 q-mb-sm">Image</div>

      <img
        :src="imageUrl"
        style="max-width: 100%; max-height: 400px; display: block; margin: auto"
      />
    </q-card-section>

    <!-- Progression -->
    <q-card-section v-if="isProcessing">
      <div class="text-subtitle2 q-mb-sm">Reconnaissance du texte...</div>

      <q-linear-progress :value="progress" size="20px" rounded />

      <div class="text-caption q-mt-sm">
        {{ status }}
      </div>
    </q-card-section>

    <!-- Résultat -->
    <q-card-section v-if="ocrText">
      <div class="text-subtitle2 q-mb-sm">Texte détecté</div>

      <q-input v-model="ocrText" type="textarea" outlined autogrow />
    </q-card-section>

    <q-card-actions align="right">
      <q-btn v-if="ocrText" label="Effacer" flat @click="reset" />

      <q-btn
        label="Lancer l'OCR"
        color="primary"
        :loading="isProcessing"
        :disable="!imageFile || isProcessing"
        @click="runOCR"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue';
import { createWorker } from 'tesseract.js';

const imageFile = ref(null);
const imageUrl = ref<any>(null);

const ocrText = ref('');
const isProcessing = ref(false);
const progress = ref(0);
const status = ref('');

let worker = null as any;

// Création de l'URL d'aperçu
function processImage(file: File) {
  ocrText.value = '';
  progress.value = 0;
  status.value = '';

  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value);
    imageUrl.value = null;
  }

  if (file) {
    imageUrl.value = URL.createObjectURL(file);
  }
}

async function runOCR() {
  if (!imageFile.value) return;

  isProcessing.value = true;
  ocrText.value = '';
  progress.value = 0;

  try {
    status.value = 'Initialisation de Tesseract...';

    worker = await createWorker('fra', 1, {
      logger: (message) => {
        console.log(message);

        if (message.status) {
          status.value = message.status;
        }

        if (message.progress) {
          progress.value = message.progress;
        }
      },
    });

    status.value = "Analyse de l'image...";

    const result = await worker.recognize(imageFile.value);

    ocrText.value = result.data.text;

    status.value = 'OCR terminé';
    progress.value = 1;
  } catch (error) {
    console.error('Erreur OCR:', error);
    status.value = 'Erreur lors de la reconnaissance';
  } finally {
    if (worker) {
      await worker.terminate();
      worker = null;
    }

    isProcessing.value = false;
  }
}

function reset() {
  ocrText.value = '';
  progress.value = 0;
  status.value = '';

  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value);
    imageUrl.value = null;
  }

  imageFile.value = null;
}

onBeforeUnmount(async () => {
  if (worker) {
    await worker.terminate();
  }

  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value);
  }
});
</script>
