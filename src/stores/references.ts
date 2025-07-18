import { defineStore } from 'pinia';
import { type Ref } from 'vue';
import { useStorage } from '@vueuse/core';
import type { References } from 'src/types/references';

export const useReferencesStore = defineStore('ReferencesStore', () => {
  const references: Ref<References> = useStorage('References', { books: [], articles: [] });
  return { references };
});
