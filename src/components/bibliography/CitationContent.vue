<template>
  <!-- Authors -->
  <!-- <span v-for="author in reference.authors" :key="author">{{ author }}. </span> -->

  <!-- <HtmlTag tag="span"
    ><span>{{ currentFormat[props.referenceType as keyof CitationsDetails]?.date?.prepend }}</span
    >{{ reference.date?.toString().slice(0, 4) || 'n.d'
    }}<span>{{ currentFormat[props.referenceType as keyof CitationsDetails]?.date?.append }}</span>
  </HtmlTag>

  <HtmlTag :tag="titleTag!"
    ><span>{{ currentFormat[props.referenceType as keyof CitationsDetails]?.title?.prepend }}</span
    >{{ reference.title
    }}<span>{{ currentFormat[props.referenceType as keyof CitationsDetails]?.title?.append }}</span>
  </HtmlTag>

  <HtmlTag :tag="publisherTag!"
    ><span>{{
      currentFormat[props.referenceType as keyof CitationsDetails]?.publisher?.prepend
    }}</span
    >{{ reference.publisher
    }}<span>{{
      currentFormat[props.referenceType as keyof CitationsDetails]?.publisher?.append
    }}</span>
  </HtmlTag>

  <HtmlTag v-if="'volume' in reference" tag="span"
    ><span>{{ currentFormat[props.referenceType as keyof CitationsDetails]?.volume?.prepend }}</span
    >{{ reference.volume
    }}<span>{{
      currentFormat[props.referenceType as keyof CitationsDetails]?.volume?.append
    }}</span>
    <span>{{ currentFormat[props.referenceType as keyof CitationsDetails]?.issue?.prepend }}</span
    >{{ reference.issue
    }}<span>{{ currentFormat[props.referenceType as keyof CitationsDetails]?.issue?.append }}</span>
  </HtmlTag>

  <HtmlTag tag="span"
    ><span>{{ currentFormat[props.referenceType as keyof CitationsDetails]?.page?.prepend }}</span
    >{{ reference.page
    }}<span>{{ currentFormat[props.referenceType as keyof CitationsDetails]?.page?.append }}</span>
  </HtmlTag> -->
  <p>{{ orderCitation }}</p>
  <p v-html="orderCitation"></p>
</template>

<script setup lang="ts">
import type { BibliographicEntry } from 'src/types/references';
import { computed, onMounted, ref } from 'vue';
import HtmlTag from './HtmlTag.vue';
import { useFormatReferenceStore } from 'src/stores/formatReference';
import type {
  CitationHtmlMap,
  Citations,
  CitationsDetails,
  CitationsProperties,
  TypeCitation,
} from 'src/types/citations';

const { currentFormat, selectedFormat } = useFormatReferenceStore();

const props = defineProps<{
  reference: BibliographicEntry;
  referenceType: string;
}>();

function formatFirstNames(array: string[], initials: boolean) {
  const result = array.map((n, i, a) => {
    // if name is already initial format return only letter
    const regexInitial = /[a-zA-Z]\./;
    if (regexInitial.test(n)) return n.slice(0, 1);

    // if more than one name, and initial add ponctuation
    if (i > 0) {
      if (initials) {
        return n.slice(0, 1) + '.';
      }
    }
    if (initials) {
      return n.slice(0, 1) + '.';
    }
    return n;
  });

  return result;
}

function formatFirstAuthor(author: { firstname: string; lastname: string }) {
  const firstname = formatFirstNames(
    author.firstname.split(' '),
    currentFormat[props.referenceType as keyof TypeCitation]?.author?.initials || false,
  );
  return author.lastname + ', ' + firstname.join(' ');
}

const authors = computed(() => {
  const formatAuthorsName = props.reference.authors?.map((author, i, a) => {
    // if ONE author
    if (i === 0) {
      return formatFirstAuthor(author);
    }

    // If MULTIPLE authors

    // get formaters
    const { initials, reverseName, linkName, lastAuthor } =
      currentFormat[props.referenceType as keyof TypeCitation]?.author ?? {};

    let replace = [
      author.lastname,
      ...formatFirstNames(author.firstname.split(' '), initials || false),
    ];

    // After the main author (first one), concat a linkname to lastName (ex: APA [, ], MLA [ ] )
    if (i > 0 && replace[0]) {
      reverseName ? replace.reverse() : null;
      replace = replace.map((e, i, a) => {
        const regex = /[a-zA-Z]+/;
        const hasFirstname = regex.test(e);
        if (e && i < a.length - 1) {
          e = hasFirstname ? e.concat(linkName as string) : e;
        }
        return e;
      });
    }

    if (i > 0 && i !== a.length - 1) {
      replace.splice(0, 0, ', ');
    }

    // on LAST author, add last author special ending
    if (i > 0 && i === a.length - 1) {
      replace.splice(0, 0, `${lastAuthor}`);
    }

    return replace.join('');
  });

  // If 3 authors and etAl as existing property
  //TODO: if adding a custom format propery, only need to add etAl in
  // if (
  //   props.reference.authors!.length > 3 &&
  //   currentFormat[props.referenceType as keyof TypeCitation]?.author?.etAl
  // ) {
  //   const firstThreeAuthors = formatAuthorsName?.slice(0, 1);
  //   firstThreeAuthors!.push(
  //     `${currentFormat[props.referenceType as keyof TypeCitation]?.author?.etAl}`,
  //   );
  //   return `${firstThreeAuthors?.join('')}`;
  // }

  return `${formatAuthorsName?.join('')}${currentFormat[props.referenceType as keyof TypeCitation]?.author?.append}`;
});

const date = computed(() => {
  return ` ${currentFormat[props.referenceType as keyof TypeCitation]?.date?.prepend}${props.reference.date?.toString().slice(0, 4) || 'n.d'}${currentFormat[props.referenceType as keyof TypeCitation]?.date?.append}`;
});

const title = computed(() => {
  return `${currentFormat[props.referenceType as keyof TypeCitation]?.title?.tagStart || ''}${currentFormat[props.referenceType as keyof TypeCitation]?.title?.prepend}${props.reference.title}${props.reference.subtitle ? ': ' + props.reference.subtitle : ''}${currentFormat[props.referenceType as keyof TypeCitation]?.title?.append}${currentFormat[props.referenceType as keyof TypeCitation]?.title?.tagEnd || ''}`;
});

const publisher = computed(() => {
  return ` ${currentFormat[props.referenceType as keyof TypeCitation]?.publisher?.tagStart || ''}${props.reference.publisher}${currentFormat[props.referenceType as keyof TypeCitation]?.publisher?.append}${currentFormat[props.referenceType as keyof TypeCitation]?.publisher?.tagEnd || ''}`;
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

const citationHtml = computed<CitationHtmlMap>(() => {
  return {
    author: authors.value,
    date: date.value,
    title: title.value,
    publisher: publisher.value,
    volume: volume.value,
    issue: issue.value,
    page: page.value,
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
