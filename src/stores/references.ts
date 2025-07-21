import { defineStore } from 'pinia';
import { type Ref } from 'vue';
import { useStorage } from '@vueuse/core';
import type { References } from 'src/types/references';
import type { Book, Quote } from 'src/types/books';

export const useReferencesStore = defineStore('ReferencesStore', () => {
  const references: Ref<References> = useStorage('References', { books: [], articles: [] });

  function add(type: string, reference: Book) {
    references.value[type as keyof References]?.unshift(reference);
  }

  function find(type: string, id: string) {
    return references.value[type as keyof References]!.find((ref) => ref.id === id);
  }

  function getTitle(type: string, id: string) {
    return references.value[type as keyof References]!.find((ref) => ref.id === id)?.title;
  }

  function remove(type: string, referenceId: string) {
    const filterReferences = references.value[type as keyof References]?.filter(
      (ref) => ref.id !== referenceId,
    );
    references.value[type as keyof References] = filterReferences as Book[];
  }

  function addQuote(type: string, bookId: string, quote: Quote) {
    console.log(type, bookId);
    const referenceFound = find(type, bookId);

    if (referenceFound && referenceFound?.quotes) {
      referenceFound?.quotes.unshift(quote);
    } else {
      referenceFound!.quotes = [quote];
    }
  }

  return { references, add, remove, addQuote, getTitle };
});
