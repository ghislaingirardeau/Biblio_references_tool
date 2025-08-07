<template>
  <span v-for="author in reference.authors" :key="author">{{ author }}. </span>

  <HtmlTag :tag="titleTag!"
    ><span>{{ formatCitations[props.referenceType as keyof Citations]?.title?.prepend }}</span
    >{{ reference.title
    }}<span>{{ formatCitations[props.referenceType as keyof Citations]?.title?.append }}</span>
  </HtmlTag>
  <HtmlTag :tag="publisherTag!"
    ><span>{{ formatCitations[props.referenceType as keyof Citations]?.publisher?.prepend }}</span
    >{{ reference.publisher
    }}<span>{{ formatCitations[props.referenceType as keyof Citations]?.publisher?.append }}</span>
  </HtmlTag>
  <HtmlTag tag="span"
    ><span>{{
      formatCitations[props.referenceType as keyof Citations]?.publisheDate?.prepend
    }}</span
    >{{ reference['published-date']?.toString().slice(0, 4)
    }}<span>{{
      formatCitations[props.referenceType as keyof Citations]?.publisheDate?.append
    }}</span>
  </HtmlTag>

  <HtmlTag v-if="'volume' in reference" tag="span"
    ><span>{{ formatCitations[props.referenceType as keyof Citations]?.volume?.prepend }}</span
    >{{ reference.volume
    }}<span>{{ formatCitations[props.referenceType as keyof Citations]?.volume?.append }}</span>
    <span>{{ formatCitations[props.referenceType as keyof Citations]?.issue?.prepend }}</span
    >{{ reference.issue
    }}<span>{{ formatCitations[props.referenceType as keyof Citations]?.issue?.append }}</span>
  </HtmlTag>

  <HtmlTag tag="span"
    ><span>{{ formatCitations[props.referenceType as keyof Citations]?.page?.prepend }}</span
    >{{ reference.page
    }}<span>{{ formatCitations[props.referenceType as keyof Citations]?.page?.append }}</span>
  </HtmlTag>

  <!-- <span v-if="'page' in reference"
    ><span v-if="formatCitations.articles.page.prepend">{{
      formatCitations.articles.page.prepend
    }}</span
    >{{ reference.page }}
    <span v-if="formatCitations.articles.page.append">{{
      formatCitations.articles.page.append
    }}</span></span
  >
  <span v-if="'pages' in reference"
    ><span v-if="formatCitations.books.page.prepend">{{ formatCitations.books.page.prepend }}</span
    >{{ reference.pages }}
    <span v-if="formatCitations.books.page.append">{{ formatCitations.books.page.append }}</span>
  </span> -->
</template>

<script setup lang="ts">
import type { BibliographicEntry } from 'src/types/references';
import { computed, ref } from 'vue';
import HtmlTag from './HtmlTag.vue';
import type { Citations } from 'src/types/citations';

const props = defineProps<{
  reference: BibliographicEntry;
  referenceType: string;
}>();

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
    publisheDate: {
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
    publisheDate: {
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

const titleTag = computed(() => {
  return formatCitations.value[props.referenceType as keyof Citations]?.title?.tag;
});

const publisherTag = computed(() => {
  return formatCitations.value[props.referenceType as keyof Citations]?.publisher?.tag;
});

import Cite from 'citation-js';

function generateCitation(entry: BibliographicEntry, style: 'apa' | 'chicago'): string {
  const cslJSON = convertToCSL(entry);

  const cite = new Cite(cslJSON);
  return cite.format('bibliography', {
    format: 'text',
    template: style,
    lang: 'en-US',
  });
}

function convertToCSL(entry: BibliographicEntry): any {
  return {
    type: mapType(entry.type!),
    author: entry.authors!.map((fullName) => {
      const [first, ...rest] = fullName.split(' ');
      return { given: first, family: rest.join(' ') };
    }),
    issued: { 'date-parts': [[parseInt(entry.date!)]] },
    title: entry.title,
    publisher: entry.publisher || entry.source,
    'container-title': entry.publisher || undefined,
    volume: entry.volume,
    issue: entry.issue,
    page: entry.page,
    URL: entry.URL,
    DOI: entry.DOI,
  };
}

function mapType(type: string): string {
  switch (type) {
    case 'book':
      return 'book';
    case 'article':
      return 'article-journal';
    case 'report':
      return 'report';
    case 'website':
      return 'webpage';
    case 'chapter':
      return 'chapter';
    default:
      return 'document';
  }
}

const entry: BibliographicEntry = {
  id: '15',
  type: 'book',
  authors: ['John Smith', 'Jane Doe'],
  date: '2020',
  title: 'The Theory of Everything',
  source: 'Oxford University Press',
};

const apaCitation = generateCitation(entry, 'apa');
const chicagoCitation = generateCitation(entry, 'chicago');

console.log('APA:', apaCitation);
console.log('Chicago:', chicagoCitation);
</script>

<style scoped></style>
