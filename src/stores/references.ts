import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import { useStorage } from '@vueuse/core';
import type { References, ReferencesType } from 'src/types/references';
import type { Article, Book, Quote } from 'src/types/books';

export const useReferencesStore = defineStore('ReferencesStore', () => {
  const references: Ref<References> = useStorage('References', { books: [], articles: [] });
  const filterReferences = ref<Pick<References, 'books' | 'articles'>[] | null>(null);
  const types: ReferencesType = ['books', 'articles', 'web'];

  const quotes = ref<Quote[] | []>([]);
  const filteredQuotes = ref<Quote[] | null>(null);

  function add(type: string, reference: Book | Article) {
    if (type === 'books') {
      (references.value.books as Book[]).unshift(reference as Book);
    } else if (type === 'articles') {
      (references.value.articles as Article[]).unshift(reference as Article);
    }
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
    const findReferences = references.value[type as keyof References]!.filter(
      (reference) =>
        reference.title!.toLowerCase().includes(lowerQuery) ||
        reference.authors!.join(' ').toLowerCase().includes(lowerQuery),
    );
    if (findReferences.length === 0) {
      return 'Book not found';
    }
    filterReferences.value = findReferences as Pick<References, 'books' | 'articles'>[];
    return null;
  }

  function resetFilter() {
    filterReferences.value = null;
  }

  function getTitle(type: string, id: string) {
    return references.value[type as keyof References]!.find((ref) => ref.id === id)?.title;
  }

  function remove(type: string, referenceId: string) {
    const findReferences = references.value[type as keyof References]?.filter(
      (ref) => ref.id !== referenceId,
    );
    references.value[type as keyof References] = findReferences as Book[] | Article[];
  }

  function addQuote(type: string, referenceId: string, quote: Quote) {
    const referenceFound = find(type, referenceId);

    if (referenceFound && referenceFound?.quotes) {
      referenceFound?.quotes.unshift(quote);
    } else {
      referenceFound!.quotes = [quote];
    }
    findQuotes(type, referenceId);
  }

  function findQuotes(type: string, referenceId: string) {
    const referenceFound = find(type, referenceId);

    if (referenceFound && referenceFound?.quotes) {
      quotes.value = referenceFound.quotes;
    } else {
      quotes.value = [];
    }
  }

  function filterQuotes(query: string) {
    filteredQuotes.value = null;
    if (!query.trim()) {
      return;
    }
    const lowerQuery = query.toLowerCase();
    const searchQuotes = quotes.value.filter((quote) =>
      quote.content.toLowerCase().includes(lowerQuery),
    );
    if (searchQuotes.length === 0) {
      return 'Quote not found';
    }
    filteredQuotes.value = searchQuotes;
    return null;
  }

  return {
    references,
    types,
    getTitle,
    add,
    remove,
    quotes,
    filteredQuotes,
    addQuote,
    findQuotes,
    filterQuotes,
    filterReferences,
    filter,
    resetFilter,
  };
});
