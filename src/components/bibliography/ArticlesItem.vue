<template>
  <div
    v-for="reference in props.references"
    :key="reference.id!"
    @click="$emit('modalEdit', reference)"
  >
    <span v-for="author in reference.authors" :key="author">{{ author }}</span
    >. <span>"{{ reference.title }}"</span>. <span class="italic">{{ reference.publisher }}</span
    >, <span>{{ reference['published-date'] }}</span
    >, <span> vol. {{ reference.volume }}({{ reference.issue }})</span>, p.
    <span>{{ reference.page }}</span
    >.
    <q-btn dense size="sm" flat round icon="edit" @click.stop="$emit('modalEdit', reference)" />
  </div>
</template>

<script setup lang="ts">
import type { Article } from 'src/types/books';

const props = defineProps<{
  references: Article[];
}>();

const emits = defineEmits(['modalEdit']);
</script>

<style scoped></style>
