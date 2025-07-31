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

  function resetReferences() {
    references.value = referencesTemplate;
  }

  function add(type: string, reference: Book | Article) {
    references.value[type as keyof References]?.lists.unshift(reference);
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

  return {
    references,
    referencesTypes,
    getTitle,
    add,
    find,
    remove,
    resetReferences,
    filterReferences,
    filter,
    resetFilter,
  };
});
