import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useModalReferenceStore = defineStore('ModalReference', () => {
  const open = ref(false);
  const isReadonly = ref(false);

  function reset() {
    open.value = false;
    isReadonly.value = false;
  }

  return { open, reset, isReadonly };
});
