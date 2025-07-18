import { defineStore } from 'pinia';
import { type Ref } from 'vue';
import { useStorage } from '@vueuse/core';
import type { References } from 'src/types/references';
import type { Book } from 'src/types/books';

export const useReferencesStore = defineStore('ReferencesStore', () => {
  const references: Ref<References> = useStorage('References', { books: [], articles: [] });

  function add(type: string, reference: Book) {
    references.value[type as keyof References]?.unshift(reference);
  }

  return { references, add };
});
