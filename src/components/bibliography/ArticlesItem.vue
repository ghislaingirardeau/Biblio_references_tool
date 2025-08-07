<template>
  <div
    v-for="reference in props.references"
    :key="reference.id!"
    @click="$emit('modalEdit', reference)"
  >
    <span v-for="author in reference.authors" :key="author">{{ author }}. </span>
    <span>{{ reference.title }}. </span><span>{{ reference.publisher }}, </span>
    <span>{{ reference['published-date'] }}, </span>
    <span v-if="'volume' in reference"> vol. {{ reference.volume }}({{ reference.issue }}),</span>
    p. <span v-if="'page' in reference">{{ reference.page }}.</span>
    <span v-if="'pages' in reference">{{ reference.pages }}.</span>
    <q-btn dense size="sm" flat round icon="edit" @click.stop="$emit('modalEdit', reference)" />
  </div>
</template>

<script setup lang="ts">
import type { ReferenceContent } from 'src/types/references';

const props = defineProps<{
  references: ReferenceContent[];
}>();

const emits = defineEmits(['modalEdit']);
</script>

<style scoped></style>
