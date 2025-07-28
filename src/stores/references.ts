import { defineStore } from 'pinia';
import { computed, ref, type Ref } from 'vue';
import { useStorage } from '@vueuse/core';
import type { References, ReferencesType } from 'src/types/references';
import type { Article, Book, Quote } from 'src/types/books';
import { referencesTemplate } from 'src/utils/useBaseReferences';

export const useReferencesStore = defineStore('ReferencesStore', () => {
  const references: Ref<References> = useStorage('References', referencesTemplate);

  const filterReferences = ref<Pick<References, 'books' | 'articles'>[] | null>(null);

  const referencesTypes = computed(() => {
    return Object.keys(references.value) as Array<keyof References>;
  });

  const quotes = ref<Quote[] | []>([]);
  const filteredQuotes = ref<Quote[] | null>(null);

  function resetReferences() {
    references.value = referencesTemplate;
  }

  function add(type: string, reference: Book | Article) {
    if (type === 'books') {
      (references.value.books?.lists as Book[]).unshift(reference as Book);
    } else if (type === 'articles') {
      (references.value.articles?.lists as Article[]).unshift(reference as Article);
    }
  }

  function find(type: string, id: string) {
    return references.value[type as keyof References]!.lists.find((ref) => ref.id === id);
  }

  function filter(type: string, query: string) {
    filterReferences.value = null;

    if (!query.trim()) {
      return;
    }
    const lowerQuery = query.toLowerCase();
    const findReferences = references.value[type as keyof References]!.lists.filter(
      (reference) =>
        reference.title!.toLowerCase().includes(lowerQuery) ||
        ('authors' in reference && reference.authors.join(' ').toLowerCase().includes(lowerQuery)),
    );
    if (findReferences.length === 0) {
      return 'Book not found';
    }
    filterReferences.value = findReferences as Pick<References, 'books' | 'articles'>[];
    return null;
  }

  function resetFilter() {
    filterReferences.value = null;
    filteredQuotes.value = null;
  }

  function getTitle(type: string, id: string) {
    return references.value[type as keyof References]!.lists.find((ref) => ref.id === id)?.title;
  }

  function remove(type: string, referenceId: string) {
    const findReferences = references.value[type as keyof References]?.lists.filter(
      (ref) => ref.id !== referenceId,
    );
    if (type === 'books') {
      references.value.books!.lists = findReferences as Book[];
    } else if (type === 'articles') {
      references.value.articles!.lists = findReferences as Article[];
    }
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
      quote.content!.toLowerCase().includes(lowerQuery),
    );
    if (searchQuotes.length === 0) {
      return 'Quote not found';
    }
    filteredQuotes.value = searchQuotes;
    return null;
  }

  return {
    references,
    referencesTypes,
    getTitle,
    add,
    remove,
    resetReferences,
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
