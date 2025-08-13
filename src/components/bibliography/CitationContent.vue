<template>
  <p v-html="orderCitation"></p>
</template>

<script setup lang="ts">
import type { BibliographicEntry } from 'src/types/references';
import { computed } from 'vue';
import { useFormatReferenceStore } from 'src/stores/formatReference';
import type { CitationHtmlMap, TypeCitation } from 'src/types/citations';
import { format } from 'quasar';
import { formatFirstAuthor, formatFirstNames } from 'src/utils/useBibliographyFormater';

const { capitalize } = format;

const { currentFormat, selectedFormat } = useFormatReferenceStore();

const props = defineProps<{
  reference: BibliographicEntry;
  referenceType: string;
}>();

const authors = computed(() => {
  if (!props.reference.authors) return '';

  const formatAuthorsName = props.reference.authors?.map((author, i, a) => {
    // get formaters
    const {
      isInitial,
      reverseName,
      linkBetweenFirstname,
      linkLastAuthor,
      linkFirstAuthorName,
      nameIsUpperCase,
    } = currentFormat[props.referenceType as keyof TypeCitation]?.author ?? {};

    author.lastname = nameIsUpperCase
      ? author.lastname.toUpperCase()
      : capitalize(author.lastname.toLowerCase());

    // if ONE author, all format mode is the same
    if (i === 0) {
      return formatFirstAuthor(author, isInitial || false, linkFirstAuthorName!);
    }

    // If MULTIPLE authors
    let formatAuthorName = [
      author.lastname,
      ...formatFirstNames(author.firstname.split(' '), isInitial || false),
    ];

    // After the main author (first one), concat a ponctuation link to lastName (ex: APA [, ], MLA [ ] )
    if (i > 0 && formatAuthorName[0]) {
      // the others authors names is reverse ?
      reverseName ? formatAuthorName.reverse() : null;

      // for each firstname (multiple first name), add the link name
      formatAuthorName = formatAuthorName.map((name, i, a) => {
        const regex = /[a-zA-Z]+/;
        const hasFirstname = regex.test(name);
        if (name && i < a.length - 1) {
          name = hasFirstname ? name.concat(linkBetweenFirstname as string) : name;
        }
        return name;
      });
    }

    // if 3 authors or more, add coma between each names, will not apply if only 2 names !
    if (i > 0 && i !== a.length - 1) {
      formatAuthorName.splice(0, 0, ', ');
    }

    // on LAST author, add last author special ending
    if (i > 0 && i === a.length - 1) {
      formatAuthorName.splice(0, 0, `${linkLastAuthor}`);
    }

    return formatAuthorName.join('');
  });

  // If format with et al.
  if (
    props.reference.authors.length > 2 &&
    currentFormat[props.referenceType as keyof TypeCitation]?.author?.etAl
  ) {
    const firstThreeAuthors = formatAuthorsName?.slice(0, 1);
    firstThreeAuthors.push(
      `${currentFormat[props.referenceType as keyof TypeCitation]?.author?.etAl}`,
    );
    return `${firstThreeAuthors?.join('')}`;
  }

  return `${formatAuthorsName?.join('')}${currentFormat[props.referenceType as keyof TypeCitation]?.author?.append}`;
});

//TODO: main author, append différement + prénom puis nom => doit avoir sa propre logique ??
const mainAuthors = computed(() => {
  if (!props.reference['main-authors']) return '';

  // get formaters
  const {
    isInitial,
    reverseName,
    linkBetweenFirstname,
    linkLastAuthor,
    linkFirstAuthorName,
    nameIsUpperCase,
    etAl,
    append,
  } = currentFormat[props.referenceType as keyof TypeCitation]?.author ?? {};

  const formatAuthorsName = props.reference['main-authors']?.map((author, i, a) => {
    author.lastname = nameIsUpperCase
      ? author.lastname.toUpperCase()
      : capitalize(author.lastname.toLowerCase());

    // if ONE author, all format mode is the same
    if (i === 0) {
      return formatFirstAuthor(author, isInitial || false, linkFirstAuthorName!);
    }

    // If MULTIPLE authors
    let formatAuthorName = [
      author.lastname,
      ...formatFirstNames(author.firstname.split(' '), isInitial || false),
    ];

    // After the main author (first one), concat a ponctuation link to lastName (ex: APA [, ], MLA [ ] )
    if (i > 0 && formatAuthorName[0]) {
      // the others authors names is reverse ?
      reverseName ? formatAuthorName.reverse() : null;

      // for each firstname (multiple first name), add the link name
      formatAuthorName = formatAuthorName.map((name, i, a) => {
        const regex = /[a-zA-Z]+/;
        const hasFirstname = regex.test(name);
        if (name && i < a.length - 1) {
          name = hasFirstname ? name.concat(linkBetweenFirstname as string) : name;
        }
        return name;
      });
    }

    // if 3 authors or more, add coma between each names, will not apply if only 2 names !
    if (i > 0 && i !== a.length - 1) {
      formatAuthorName.splice(0, 0, ', ');
    }

    // on LAST author, add last author special ending
    if (i > 0 && i === a.length - 1) {
      formatAuthorName.splice(0, 0, `${linkLastAuthor}`);
    }

    return formatAuthorName.join('');
  });

  // If format with et al.
  if (props.reference['main-authors'].length > 2 && etAl) {
    const firstThreeAuthors = formatAuthorsName?.slice(0, 1);
    firstThreeAuthors.push(`${etAl}`);
    return `${firstThreeAuthors?.join('')}`;
  }

  return `${formatAuthorsName?.join('')}${append}`;
});

const date = computed(() => {
  return `${currentFormat[props.referenceType as keyof TypeCitation]?.date?.prepend}${props.reference.date?.toString().slice(0, 4) || 'n.d'}${currentFormat[props.referenceType as keyof TypeCitation]?.date?.append}`;
});

const title = computed(() => {
  return `${currentFormat[props.referenceType as keyof TypeCitation]?.title?.tagStart || ''}${currentFormat[props.referenceType as keyof TypeCitation]?.title?.prepend}${props.reference.title}${props.reference.subtitle ? ': ' + props.reference.subtitle : ''}${currentFormat[props.referenceType as keyof TypeCitation]?.title?.append}${currentFormat[props.referenceType as keyof TypeCitation]?.title?.tagEnd || ''}`;
});

const publisher = computed(() => {
  return !props.reference.publisher
    ? ''
    : `${currentFormat[props.referenceType as keyof TypeCitation]?.publisher?.tagStart || ''}${currentFormat[props.referenceType as keyof TypeCitation]?.publisher?.prepend}${props.reference.publisher}${currentFormat[props.referenceType as keyof TypeCitation]?.publisher?.append}${currentFormat[props.referenceType as keyof TypeCitation]?.publisher?.tagEnd || ''}`;
});

const journal = computed(() => {
  return !props.reference.journal
    ? ''
    : `${currentFormat[props.referenceType as keyof TypeCitation]?.journal?.tagStart || ''}${currentFormat[props.referenceType as keyof TypeCitation]?.journal?.prepend}${props.reference.journal}${currentFormat[props.referenceType as keyof TypeCitation]?.journal?.append}${currentFormat[props.referenceType as keyof TypeCitation]?.journal?.tagEnd || ''}`;
});

const volume = computed(() => {
  return !props.reference.volume
    ? ''
    : `${currentFormat[props.referenceType as keyof TypeCitation]?.volume?.tagStart || ''}${currentFormat[props.referenceType as keyof TypeCitation]?.volume?.prepend}${props.reference.volume}${currentFormat[props.referenceType as keyof TypeCitation]?.volume?.append}${currentFormat[props.referenceType as keyof TypeCitation]?.publisher?.tagEnd || ''}`;
});

const issue = computed(() => {
  return !props.reference.issue
    ? ''
    : `${currentFormat[props.referenceType as keyof TypeCitation]?.issue?.prepend}${props.reference.issue}${currentFormat[props.referenceType as keyof TypeCitation]?.issue?.append}`;
});

const mainTitle = computed(() => {
  console.log(props.reference['main-title']);
  return !props.reference['main-title']
    ? ''
    : `${currentFormat[props.referenceType as keyof TypeCitation]['main-title']?.prepend}${props.reference['main-title']}${currentFormat[props.referenceType as keyof TypeCitation]['main-title']?.append}`;
});

const pages = computed(() => {
  return !props.reference.pages
    ? ''
    : `${currentFormat[props.referenceType as keyof TypeCitation]?.pages?.prepend}${props.reference.pages}${currentFormat[props.referenceType as keyof TypeCitation]?.pages?.append}`;
});

const page = computed(() => {
  return !props.reference.page || !currentFormat[props.referenceType as keyof TypeCitation].page
    ? ''
    : `${currentFormat[props.referenceType as keyof TypeCitation]?.page?.prepend}${props.reference.page}${currentFormat[props.referenceType as keyof TypeCitation]?.page?.append}`;
});

const URL = computed(() => {
  return !props.reference.URL
    ? ''
    : `${currentFormat[props.referenceType as keyof TypeCitation]?.URL?.tagStart || ''}${currentFormat[props.referenceType as keyof TypeCitation]?.URL?.prepend}${props.reference.URL}${currentFormat[props.referenceType as keyof TypeCitation]?.URL?.append}${currentFormat[props.referenceType as keyof TypeCitation]?.URL?.tagEnd || ''}`;
});

const name = computed(() => {
  return !props.reference.name
    ? ''
    : `${currentFormat[props.referenceType as keyof TypeCitation]?.name?.tagStart || ''}${currentFormat[props.referenceType as keyof TypeCitation]?.name?.prepend}${props.reference.name}${currentFormat[props.referenceType as keyof TypeCitation]?.name?.append}${currentFormat[props.referenceType as keyof TypeCitation]?.name?.tagEnd || ''}`;
});

const location = computed(() => {
  return !props.reference.location
    ? ''
    : `${currentFormat[props.referenceType as keyof TypeCitation]?.location?.tagStart || ''}${currentFormat[props.referenceType as keyof TypeCitation]?.location?.prepend}${props.reference.location}${currentFormat[props.referenceType as keyof TypeCitation]?.location?.append}${currentFormat[props.referenceType as keyof TypeCitation]?.location?.tagEnd || ''}`;
});

const institution = computed(() => {
  return !props.reference.institution
    ? ''
    : `${currentFormat[props.referenceType as keyof TypeCitation]?.institution?.tagStart || ''}${currentFormat[props.referenceType as keyof TypeCitation]?.institution?.prepend}${props.reference.institution}${currentFormat[props.referenceType as keyof TypeCitation]?.institution?.append}${currentFormat[props.referenceType as keyof TypeCitation]?.institution?.tagEnd || ''}`;
});

const degree = computed(() => {
  return !props.reference.degree
    ? ''
    : `${currentFormat[props.referenceType as keyof TypeCitation]?.degree?.tagStart || ''}${currentFormat[props.referenceType as keyof TypeCitation]?.degree?.prepend}${props.reference.degree}${currentFormat[props.referenceType as keyof TypeCitation]?.degree?.append}${currentFormat[props.referenceType as keyof TypeCitation]?.degree?.tagEnd || ''}`;
});

const citationHtml = computed<CitationHtmlMap>(() => {
  return {
    author: authors.value,
    date: date.value,
    title: title.value,
    publisher: publisher.value,
    journal: journal.value,
    volume: volume.value,
    issue: issue.value,
    page: page.value,
    pages: pages.value,
    ['main-title']: mainTitle.value,
    ['main-authors']: mainAuthors.value,
    URL: URL.value,
    name: name.value,
    location: location.value,
    institution: institution.value,
    degree: degree.value,
  };
});

const orderCitation = computed(() => {
  let htmlContent = '';
  for (const element of currentFormat[props.referenceType as keyof TypeCitation].order) {
    if (element in citationHtml.value) {
      htmlContent += citationHtml.value[element as keyof CitationHtmlMap] ?? '';
    }
  }
  return htmlContent;
});

/* ------------------- */
</script>

<style scoped></style>
