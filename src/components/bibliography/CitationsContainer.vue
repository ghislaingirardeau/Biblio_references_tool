<template>
  <div
    v-for="reference in props.references"
    :key="reference.id!"
    @click="$emit('modalEdit', reference)"
  >
    <CitationContent :reference="reference" :referenceType="referenceType" />
    <q-btn dense size="sm" flat round icon="edit" @click.stop="$emit('modalEdit', reference)" />
  </div>
</template>

<script setup lang="ts">
import type { ReferenceContent } from 'src/types/references';

import CitationContent from './CitationContent.vue';

const props = defineProps<{
  references: ReferenceContent[];
  referenceType: string;
}>();

const emits = defineEmits(['modalEdit']);
</script>

<style scoped></style>
