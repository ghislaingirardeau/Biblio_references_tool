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
      web: {
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
      bookChapter: {
        order: ['author', 'date', 'title', 'main-title', 'main-authors', 'pages', 'publisher'],
        ['main-title']: {
          prepend: 'In ',
          append: ', edited by ',
        },
        ['main-authors']: {
          prepend: '',
          append: '.',
        },
        title: {
          prepend: '"',
          append: '." ',
        },
        publisher: {
          prepend: ' ',
          append: '.',
        },
        date: {
          prepend: ' ',
          append: '. ',
        },
        pages: {
          prepend: ' ',
          append: '.',
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
      conferencePaper: {
        order: ['author', 'name', 'date', 'title', 'publisher'],
        title: {
          tagStart: '<em>',
          tagEnd: '</em>',
          prepend: '',
          append: '.',
        },
        name: {
          append: '',
          prepend: '',
        },
        location: {
          prepend: '',
          append: '',
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
      thesis: {
        order: ['author', 'date', 'title', 'degree', 'institution', 'doi', 'url'],
        title: {
          prepend: '"',
          append: '".',
        },
        date: {
          prepend: ' ',
          append: '. ',
        },
        institution: {
          prepend: ' ',
          append: '. ',
        },
        degree: {
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
      report: {
        order: ['title', 'date', 'journal', 'URL'],
        title: {
          tagStart: '<em>',
          tagEnd: '</em>',
          prepend: '',
          append: '.',
        },
        journal: {
          tagStart: '<em>',
          tagEnd: '</em>',
          prepend: ' ',
          append: '. ',
        },
        date: {
          prepend: ' ',
          append: '. ',
        },
        URL: {
          tagStart: '<u>',
          tagEnd: '</u>',
          prepend: '',
          append: '. ',
        },
      },
      newspaperArticle: {
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
      web: {
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
      bookChapter: {
        order: ['author', 'date', 'title', 'main-authors', 'main-title', 'pages', 'publisher'],
        ['main-title']: {
          prepend: ' ',
          append: '',
        },
        ['main-authors']: {
          prepend: '',
          append: '.',
        },
        title: {
          prepend: '',
          append: '. In ',
        },
        publisher: {
          prepend: ' ',
          append: '.',
        },
        date: {
          prepend: ' (',
          append: '). ',
        },
        pages: {
          prepend: ' (pp. ',
          append: ').',
        },
        author: {
          prepend: '',
          append: ',',
          isInitial: true,
          linkBetweenFirstname: ', ',
          linkFirstAuthorName: ', ',
          linkLastAuthor: ', & ',
          nameIsUpperCase: false,
          reverseName: false,
        },
      },
      conferencePaper: {
        order: ['author', 'name', 'date', 'title', 'publisher'],
        title: {
          tagStart: '<em>',
          tagEnd: '</em>',
          prepend: '',
          append: '.',
        },
        name: {
          append: '',
          prepend: '',
        },
        location: {
          prepend: '',
          append: '',
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
      thesis: {
        order: ['author', 'date', 'title', 'degree', 'institution', 'doi', 'url'],
        title: {
          prepend: '"',
          append: '".',
        },
        institution: {
          prepend: ' ',
          append: '. ',
        },
        degree: {
          prepend: ' ',
          append: '. ',
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
      report: {
        order: ['title', 'date', 'journal', 'URL'],
        title: {
          tagStart: '',
          tagEnd: '',
          prepend: '',
          append: '.',
        },
        journal: {
          tagStart: '',
          tagEnd: '</em>',
          prepend: ' In <em>',
          append: '. ',
        },
        date: {
          prepend: ' (',
          append: ').',
        },
        URL: {
          tagStart: '<u>',
          tagEnd: '</u>',
          prepend: '',
          append: '. ',
        },
      },
      newspaperArticle: {
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
      web: {
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
      bookChapter: {
        order: ['author', 'title', 'main-title', 'main-authors', 'date', 'publisher', 'pages'],
        ['main-title']: {
          prepend: ' ',
          append: ', edited by ',
        },
        ['main-authors']: {
          prepend: '',
          append: '.',
        },
        title: {
          prepend: '"',
          append: '." ',
        },
        publisher: {
          prepend: ' ',
          append: ', ',
        },
        date: {
          prepend: '',
          append: ', ',
        },
        pages: {
          prepend: 'pp. ',
          append: '.',
        },
        author: {
          prepend: '',
          append: ', ',
          isInitial: false,
          linkFirstAuthorName: ', ',
          linkLastAuthor: ', and ',
          linkBetweenFirstname: ' ',
          nameIsUpperCase: false,
          reverseName: true,
        },
      },
      conferencePaper: {
        name: {
          append: '',
          prepend: '',
        },
        location: {
          prepend: '',
          append: '',
        },

        order: ['author', 'name', 'date', 'title', 'publisher'],
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
      thesis: {
        order: ['author', 'date', 'title', 'degree', 'institution', 'doi', 'url'],
        title: {
          prepend: '"',
          append: '".',
        },
        institution: {
          prepend: ' ',
          append: '. ',
        },
        degree: {
          prepend: ' ',
          append: '. ',
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
      report: {
        order: ['title', 'journal', 'date', 'URL'],
        title: {
          tagStart: '',
          tagEnd: '',
          prepend: '"',
          append: '".',
        },
        journal: {
          tagStart: '<em>',
          tagEnd: '</em>',
          prepend: ' ',
          append: ', ',
        },
        date: {
          prepend: '',
          append: ', ',
        },
        URL: {
          tagStart: '<u>',
          tagEnd: '</u>',
          prepend: '',
          append: '. ',
        },
      },
      newspaperArticle: {
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
      web: {
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
      bookChapter: {
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
      conferencePaper: {
        order: ['author', 'name', 'date', 'title', 'publisher'],
        title: {
          tagStart: '<em>',
          tagEnd: '</em>',
          prepend: '',
          append: '.',
        },
        name: {
          append: '',
          prepend: '',
        },
        location: {
          prepend: '',
          append: '',
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
      thesis: {
        order: ['author', 'date', 'title', 'degree', 'institution', 'doi', 'url'],
        title: {
          prepend: '"',
          append: '".',
        },
        institution: {
          prepend: ' ',
          append: '. ',
        },
        degree: {
          prepend: ' ',
          append: '. ',
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
      report: {
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
      newspaperArticle: {
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
