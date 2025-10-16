<template>
  <div class="p-2 flex flex-center">
    <q-file v-model="image" label="Upload image to extract text" filled class="w-72 mr-5" />
    <vue-cropper
      v-if="previewUrl"
      ref="cropper"
      :key="previewUrl"
      :src="previewUrl"
      alt="Source Image"
      class="w-full my-4"
      @cropend="cropImage"
    >
    </vue-cropper>
    <q-btn
      :loading="loading"
      :disable="loading"
      color="primary"
      @click="sendToOCR"
      label="extract text"
    />
    <q-btn
      outline
      color="primary"
      @click="modalReferenceStore.reset()"
      label="Close"
      class="q-ml-md"
    />
  </div>
</template>

<script setup lang="ts">
import { useModalReferenceStore } from 'src/stores/modalReferences';
import type { Quote } from 'src/types/references';
import { ref, watch } from 'vue';

import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import { Notify } from 'quasar';
import { getAuth } from 'firebase/auth';

const modalReferenceStore = useModalReferenceStore();

const image = ref<File | null>(null);
// Use 'any' as VueCropper does not export an instance type
const cropper = ref<any>(null);
const imageCropped = ref<ImageData | null>(null);

const loading = ref(false);

const newQuote = defineModel<Quote>('newQuote');
const emits = defineEmits(['next-step']);
const previewUrl = ref<string | null>(null);

watch(
  () => image.value,
  (newValue) => {
    cropper.value = null;
    imageCropped.value = null;
    previewUrl.value = URL.createObjectURL(image.value!);

    setTimeout(() => {
      cropImage();
    }, 500);
  },
);

function cropImage() {
  const options = { maxWidth: 1100, maxHeight: 1100 };
  imageCropped.value = cropper.value!.getCroppedCanvas(options).toDataURL('image/jpeg');
}

async function sendToOCR() {
  try {
    loading.value = true;
    const auth = getAuth();
    const user = auth.currentUser;
    const token = await user!.getIdToken();
    const response = await fetch(`${process.env.API}/ocrCapture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ imageBase64: imageCropped.value }),
    });

    const data = await response.json();

    newQuote.value!.content = data.text;

    emits('next-step');
  } catch (err) {
    Notify.create({
      message: 'Error: extracting text.',
      color: 'negative',
      icon: 'system_update',
      timeout: 3000,
    });
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
