import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useModalReferenceStore = defineStore('ModalReference', () => {
  const open = ref(false);

  function reset() {
    open.value = false;
  }

  return { open, reset };
});
