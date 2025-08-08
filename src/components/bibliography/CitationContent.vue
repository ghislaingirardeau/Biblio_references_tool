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
  <p>{{ citationHtml }}</p>
  <p v-html="citationHtml"></p>
</template>

<script setup lang="ts">
import type { BibliographicEntry } from 'src/types/references';
import { computed, onMounted, ref } from 'vue';
import HtmlTag from './HtmlTag.vue';
import { useFormatReferenceStore } from 'src/stores/formatReference';
import type { Citations, CitationsDetails, TypeCitation } from 'src/types/citations';

const { currentFormat } = useFormatReferenceStore();

const props = defineProps<{
  reference: BibliographicEntry;
  referenceType: string;
}>();

/* Set special style like em, u or strong */

// const titleTag = computed(() => {
//   return currentFormat[props.referenceType as keyof TypeCitation]?.title?.tag;
// });

// const publisherTag = computed(() => {
//   return currentFormat[props.referenceType as keyof TypeCitation]?.publisher?.tag;
// });

const authors = computed(() => {
  return `${props.reference.authors?.join(', ')}${currentFormat[props.referenceType as keyof TypeCitation]?.author?.append}`;
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

const citationHtml = computed(() => {
  return (
    authors.value +
    date.value +
    title.value +
    publisher.value +
    volume.value +
    issue.value +
    page.value
  );
});

/* ------------------- */
</script>

<style scoped></style>
