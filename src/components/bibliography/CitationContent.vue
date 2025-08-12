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
    URL: URL.value,
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
