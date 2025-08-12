import { defineStore } from 'pinia';
import type { Citations, CitationsDetails } from 'src/types/citations';
import { computed, ref, type Ref } from 'vue';

export const useFormatReferenceStore = defineStore('FormatReferenceStore', () => {
  const selectedFormat = ref('chicago');

  const formats = ref(['chicago', 'APA', 'MLA']);

  const formatCitations = ref<Citations>({
    chicago: {
      books: {
        order: ['author', 'date', 'title', 'publisher'],
        title: {
          tagStart: '<em>',
          tagEnd: '</em>',
          prepend: '',
          append: '.',
        },
        publisher: {
          prepend: ' ',
          append: '.',
        },
        date: {
          prepend: ' ',
          append: '. ',
        },
        author: {
          prepend: '',
          append: '.',
          isInitial: false,
          linkFirstAuthorName: ', ',
          linkLastAuthor: ', and ',
          linkBetweenFirstname: ' ',
          nameIsUpperCase: false,
          reverseName: true,
        },
      },
      articles: {
        order: ['author', 'date', 'title', 'publisher', 'volume', 'issue', 'page', 'doi'],
        title: {
          prepend: '"',
          append: '".',
        },
        publisher: {
          tagStart: '<em>',
          tagEnd: '</em>',
          prepend: ' ',
          append: ' ',
        },
        date: {
          prepend: ' ',
          append: '. ',
        },
        author: {
          prepend: '',
          append: '.',
          isInitial: false,
          linkFirstAuthorName: ', ',
          linkLastAuthor: ', and ',
          linkBetweenFirstname: ' ',
          nameIsUpperCase: false,
          reverseName: true,
        },
        page: {
          append: '.',
          prepend: ': ',
        },
        volume: {
          prepend: '',
          append: ' ',
        },
        issue: {
          prepend: '(',
          append: ')',
        },
      },
    },
    APA: {
      books: {
        order: ['author', 'date', 'title', 'publisher'],
        title: {
          tagStart: '<em>',
          tagEnd: '</em>',
          prepend: '',
          append: '. ',
        },
        publisher: {
          prepend: ' ',
          append: '.',
        },
        date: {
          prepend: ' (',
          append: '). ',
        },
        author: {
          prepend: '',
          append: ' ',
          isInitial: true,
          linkBetweenFirstname: ', ',
          linkFirstAuthorName: ', ',
          linkLastAuthor: ', & ',
          nameIsUpperCase: false,
          reverseName: false,
        },
      },
      articles: {
        order: ['author', 'date', 'title', 'publisher', 'volume', 'issue', 'page', 'doi'],
        title: {
          prepend: '',
          append: '. ',
        },
        publisher: {
          tagStart: '<em>',
          tagEnd: '</em>',
          prepend: ' ',
          append: ', ',
        },
        date: {
          prepend: ' (',
          append: '). ',
        },
        author: {
          prepend: '',
          append: ' ',
          isInitial: true,
          linkBetweenFirstname: ', ',
          linkFirstAuthorName: ', ',
          linkLastAuthor: ', & ',
          nameIsUpperCase: false,
          reverseName: false,
        },
        page: {
          append: '.',
          prepend: ', ',
        },
        volume: {
          tagStart: '<em>',
          tagEnd: '</em>',
          prepend: '',
          append: ' ',
        },
        issue: {
          prepend: '(',
          append: ')',
        },
      },
    },
    MLA: {
      books: {
        order: ['author', 'title', 'publisher', 'date'],
        title: {
          tagStart: '<em>',
          tagEnd: '</em>',
          prepend: '',
          append: '.',
        },
        publisher: {
          prepend: ' ',
          append: ',',
        },
        date: {
          prepend: ' ',
          append: '. ',
        },
        author: {
          prepend: '',
          append: '. ',
          isInitial: false,
          linkFirstAuthorName: ', ',
          linkLastAuthor: ', and ',
          linkBetweenFirstname: ' ',
          nameIsUpperCase: false,
          reverseName: true,
          etAl: ', et al. ',
        },
      },
      articles: {
        order: ['author', 'title', 'publisher', 'volume', 'issue', 'date', 'page'],
        title: {
          prepend: '"',
          append: '".',
        },
        publisher: {
          tagStart: '<em>',
          tagEnd: '</em>',
          prepend: ' ',
          append: ', ',
        },
        date: {
          prepend: ' ',
          append: ', ',
        },
        author: {
          prepend: '',
          append: '. ',
          isInitial: false,
          linkFirstAuthorName: ', ',
          linkLastAuthor: ', and ',
          linkBetweenFirstname: ' ',
          nameIsUpperCase: false,
          reverseName: true,
          etAl: ', et al. ',
        },
        page: {
          append: '.',
          prepend: 'pp. ',
        },
        volume: {
          prepend: 'vol. ',
          append: ', ',
        },
        issue: {
          prepend: 'no. ',
          append: ', ',
        },
      },
    },
    custom: {
      books: {
        order: ['author', 'date', 'title', 'publisher'],
        title: {
          tagStart: '<em>',
          tagEnd: '</em>',
          prepend: '',
          append: '.',
        },
        publisher: {
          prepend: ' ',
          append: '.',
        },
        date: {
          prepend: ' ',
          append: '. ',
        },
        author: {
          prepend: '',
          append: '.',
          isInitial: false,
          linkFirstAuthorName: ', ',
          linkLastAuthor: ', and ',
          linkBetweenFirstname: ' ',
          nameIsUpperCase: false,
          reverseName: true,
        },
      },
      articles: {
        order: ['author', 'date', 'title', 'publisher', 'volume', 'issue', 'page', 'doi'],
        title: {
          prepend: '"',
          append: '".',
        },
        publisher: {
          tagStart: '<em>',
          tagEnd: '</em>',
          prepend: ' ',
          append: ' ',
        },
        date: {
          prepend: ' ',
          append: '. ',
        },
        author: {
          prepend: '',
          append: '.',
          isInitial: false,
          linkFirstAuthorName: ', ',
          linkLastAuthor: ', and ',
          linkBetweenFirstname: ' ',
          nameIsUpperCase: false,
          reverseName: true,
        },
        page: {
          append: '.',
          prepend: ': ',
        },
        volume: {
          prepend: '',
          append: ' ',
        },
        issue: {
          prepend: '(',
          append: ')',
        },
      },
    },
  });

  const currentFormat = computed(() => {
    return formatCitations.value[selectedFormat.value as keyof Citations];
  });

  return {
    currentFormat,
    selectedFormat,
    formats,
  };
});
