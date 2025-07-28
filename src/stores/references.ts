import { defineStore } from 'pinia';
import { computed, ref, type Ref } from 'vue';
import { useStorage } from '@vueuse/core';
import type { References, ReferencesType } from 'src/types/references';
import type { Article, Book, Quote } from 'src/types/books';

export const useReferencesStore = defineStore('ReferencesStore', () => {
  const references: Ref<References> = useStorage('References', {
    articles: {
      lists: [],
      type: 'articles',
      label: 'Journal Article',
      description: 'A scholarly article published in an academic journal.',
    },
    books: {
      lists: [],
      type: 'books',
      label: 'Book',
      description: 'A complete book written by one or more authors.',
    },
    bookChapter: {
      lists: [],
      type: 'bookChapter',
      label: 'Book Chapter',
      description: 'A chapter or section within an edited book.',
    },
    conferencePaper: {
      lists: [],
      type: 'conferencePaper',
      label: 'Conference Paper',
      description: 'A paper presented at a conference or symposium.',
    },
    thesis: {
      lists: [],
      type: 'thesis',
      label: 'Thesis or Dissertation',
      description: 'An academic dissertation or thesis submitted for a degree.',
    },
    report: {
      lists: [],
      type: 'report',
      label: 'Report',
      description: 'A technical or research report published by an institution or organization.',
    },
    web: {
      lists: [],
      type: 'web',
      label: 'Web Page',
      description: 'Content from an online source, such as a website or blog post.',
    },
    newspaperArticle: {
      lists: [],
      type: 'newspaperArticle',
      label: 'Newspaper Article',
      description: 'An article published in a newspaper.',
    },
    magazineArticle: {
      lists: [],
      type: 'magazineArticle',
      label: 'Magazine Article',
      description: 'An article published in a magazine or popular journal.',
    },
    dataset: {
      lists: [],
      type: 'dataset',
      label: 'Dataset',
      description: 'A published or archived dataset used in research.',
    },
    software: {
      lists: [],
      type: 'software',
      label: 'Software',
      description: 'Software or code used or cited in the research.',
    },
    interview: {
      lists: [],
      type: 'interview',
      label: 'Interview',
      description: 'A personal or published interview used as a source.',
    },
    film: {
      lists: [],
      type: 'film',
      label: 'Film or Video',
      description: 'A film, video, or documentary referenced in the research.',
    },
    legalCase: {
      lists: [],
      type: 'legalCase',
      label: 'Legal Case',
      description: 'A legal decision or court case.',
    },
    legislation: {
      lists: [],
      type: 'legislation',
      label: 'Legislation',
      description: 'A law, statute, or regulation.',
    },
    patent: {
      lists: [],
      type: 'patent',
      label: 'Patent',
      description: 'A government-issued patent document.',
    },
    manuscript: {
      lists: [],
      type: 'manuscript',
      label: 'Manuscript',
      description: 'An unpublished or in-progress work.',
    },
    presentation: {
      lists: [],
      type: 'presentation',
      label: 'Presentation or Lecture',
      description: 'An oral presentation, lecture, or slide deck.',
    },
    audio: {
      lists: [],
      type: 'audio',
      label: 'Audio Recording',
      description: 'A recorded audio source, such as a podcast.',
    },
    image: {
      lists: [],
      type: 'image',
      label: 'Image or Figure',
      description: 'A visual source such as a photo, painting, or diagram.',
    },
  });

  const filterReferences = ref<Pick<References, 'books' | 'articles'>[] | null>(null);

  const referencesTypes = computed(() => {
    return Object.keys(references.value) as Array<keyof References>;
  });

  const quotes = ref<Quote[] | []>([]);
  const filteredQuotes = ref<Quote[] | null>(null);

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
