<template>
  <div
    v-for="reference in props.references"
    :key="reference.id!"
    @click="$emit('modalEdit', reference)"
  >
    <span v-for="author in reference.authors" :key="author">{{ author }}</span
    >. <span class="italic">{{ reference.title }}</span
    >. <span>{{ reference.publisher }}</span
    >, <span>{{ reference['published-date']?.slice(0, 4) }}</span
    >, <span>{{ reference.page }}</span> pages.
    <q-btn dense size="sm" flat round icon="edit" @click.stop="$emit('modalEdit', reference)" />
  </div>
</template>

<script setup lang="ts">
import type { BibliographicEntry } from 'src/types/references';

const props = defineProps<{
  references: BibliographicEntry[];
}>();

const emits = defineEmits(['modalEdit']);
</script>

<style scoped></style>
