<template>
  <div v-for="reference in props.references" :key="reference.id!">
    <CitationContent
      :reference="reference"
      :referenceType="referenceType"
      @click.stop="$emit('modalEdit', reference)"
      class="cursor-pointer"
    />
    <!-- <q-btn dense size="sm" flat round icon="edit" @click.stop="$emit('modalEdit', reference)" /> -->
  </div>
</template>

<script setup lang="ts">
import type { BibliographicEntry } from 'src/types/references';

import CitationContent from './CitationContent.vue';

const props = defineProps<{
  references: BibliographicEntry[];
  referenceType: string;
}>();

const emits = defineEmits(['modalEdit']);
</script>

<style scoped></style>
