import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import { useStorage } from '@vueuse/core';
import type { References } from 'src/types/references';
import type { Book, Quote } from 'src/types/books';

export const useReferencesStore = defineStore('ReferencesStore', () => {
  const references: Ref<References> = useStorage('References', { books: [], articles: [] });

  const filterReferences = ref<Pick<References, 'books' | 'articles'>[] | null>(null);

  function add(type: string, reference: Book) {
    references.value[type as keyof References]?.unshift(reference);
  }

  function find(type: string, id: string) {
    return references.value[type as keyof References]!.find((ref) => ref.id === id);
  }

  function filter(type: string, query: string) {
    filterReferences.value = null;

    if (!query.trim()) {
      return;
    }
    const lowerQuery = query.toLowerCase();
    const resFilterReferences = references.value[type as keyof References]!.filter(
      (reference) =>
        reference.title!.toLowerCase().includes(lowerQuery) ||
        reference.authors!.join(' ').toLowerCase().includes(lowerQuery),
    );
    if (resFilterReferences.length === 0) {
      return 'Book not found';
    }
    filterReferences.value = resFilterReferences as Pick<References, 'books' | 'articles'>[];
    return null;
  }

  function resetFilter() {
    filterReferences.value = null;
  }

  function getTitle(type: string, id: string) {
    return references.value[type as keyof References]!.find((ref) => ref.id === id)?.title;
  }

  function remove(type: string, referenceId: string) {
    const resFilterReferences = references.value[type as keyof References]?.filter(
      (ref) => ref.id !== referenceId,
    );
    references.value[type as keyof References] = resFilterReferences as Book[];
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

  return { references, add, remove, addQuote, getTitle, filterReferences, filter, resetFilter };
});
