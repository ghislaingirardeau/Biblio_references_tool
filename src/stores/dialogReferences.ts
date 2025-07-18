import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useModalReferenceStore = defineStore('ModalReference', () => {
  const open = ref(false);
  const isForReference = ref(false);
  const isForQuote = ref(false);

  function reset() {
    open.value = false;
    isForReference.value = false;
    isForQuote.value = false;
  }

  return { open, isForReference, isForQuote, reset };
});
