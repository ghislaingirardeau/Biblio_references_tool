import { defineStore } from 'pinia';
import type { Citations } from 'src/types/citations';
import { ref, type Ref } from 'vue';

export const useFormatReferenceStore = defineStore('FormatReferenceStore', () => {
  const formatCitations = ref<Citations>({
    books: {
      title: {
        tag: 'em',
        prepend: '',
        append: '. ',
      },
      publisher: {
        tag: 'span',
        prepend: '',
        append: '. ',
      },
      date: {
        tag: 'span',
        prepend: '',
        append: ', ',
      },
      author: {
        tag: 'span',
        prepend: '',
        append: ', ',
      },
      page: {
        tag: 'span',
        append: ' pages.',
        prepend: '',
      },
    },
    articles: {
      title: {
        tag: 'span',
        prepend: '"',
        append: '". ',
      },
      publisher: {
        tag: 'em',
        prepend: '',
        append: ', ',
      },
      date: {
        tag: 'span',
        prepend: '(',
        append: '), ',
      },
      volume: {
        tag: 'span',
        prepend: 'Vol. ',
        append: ' ',
      },
      issue: {
        tag: 'span',
        prepend: 'issue ',
        append: ', ',
      },
      author: {
        tag: 'span',
        prepend: 'issue ',
        append: ', ',
      },
      page: {
        tag: 'span',
        append: '.',
        prepend: ' pp.',
      },
    },
  });

  return {
    formatCitations,
  };
});
