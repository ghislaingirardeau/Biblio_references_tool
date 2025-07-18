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

  function remove(type: string, referenceId: string) {
    const filterReferences = references.value[type as keyof References]?.filter(
      (ref) => ref.id !== referenceId,
    );
    references.value[type as keyof References] = filterReferences as Book[];
  }

  return { references, add, remove };
});
