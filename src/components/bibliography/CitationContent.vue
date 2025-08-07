<template>
  <!-- Authors -->
  <span v-for="author in reference.authors" :key="author">{{ author }}. </span>

  <!-- Date -->
  <HtmlTag tag="span"
    ><span>{{ formatCitations[props.referenceType as keyof Citations]?.date?.prepend }}</span
    >{{ reference.date?.toString().slice(0, 4)
    }}<span>{{ formatCitations[props.referenceType as keyof Citations]?.date?.append }}</span>
  </HtmlTag>

  <!-- Title -->
  <HtmlTag :tag="titleTag!"
    ><span>{{ formatCitations[props.referenceType as keyof Citations]?.title?.prepend }}</span
    >{{ reference.title
    }}<span>{{ formatCitations[props.referenceType as keyof Citations]?.title?.append }}</span>
  </HtmlTag>

  <!-- Publisher -->
  <HtmlTag :tag="publisherTag!"
    ><span>{{ formatCitations[props.referenceType as keyof Citations]?.publisher?.prepend }}</span
    >{{ reference.publisher
    }}<span>{{ formatCitations[props.referenceType as keyof Citations]?.publisher?.append }}</span>
  </HtmlTag>

  <!-- Volume / issue -->
  <HtmlTag v-if="'volume' in reference" tag="span"
    ><span>{{ formatCitations[props.referenceType as keyof Citations]?.volume?.prepend }}</span
    >{{ reference.volume
    }}<span>{{ formatCitations[props.referenceType as keyof Citations]?.volume?.append }}</span>
    <span>{{ formatCitations[props.referenceType as keyof Citations]?.issue?.prepend }}</span
    >{{ reference.issue
    }}<span>{{ formatCitations[props.referenceType as keyof Citations]?.issue?.append }}</span>
  </HtmlTag>

  <!-- Page -->
  <HtmlTag tag="span"
    ><span>{{ formatCitations[props.referenceType as keyof Citations]?.page?.prepend }}</span
    >{{ reference.page
    }}<span>{{ formatCitations[props.referenceType as keyof Citations]?.page?.append }}</span>
  </HtmlTag>
</template>

<script setup lang="ts">
import type { BibliographicEntry } from 'src/types/references';
import { computed, onMounted, ref } from 'vue';
import HtmlTag from './HtmlTag.vue';
import type { Citations } from 'src/types/citations';
import { useFormatReferenceStore } from 'src/stores/formatReference';

const { formatCitations } = useFormatReferenceStore();

const props = defineProps<{
  reference: BibliographicEntry;
  referenceType: string;
}>();

const titleTag = computed(() => {
  return formatCitations[props.referenceType as keyof Citations]?.title?.tag;
});

const publisherTag = computed(() => {
  return formatCitations[props.referenceType as keyof Citations]?.publisher?.tag;
});
</script>

<style scoped></style>
