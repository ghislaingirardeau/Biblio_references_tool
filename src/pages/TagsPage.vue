<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <tags-containers title="References">
      <TagsReferences />
    </tags-containers>

    <tags-containers title="Quotes">
      <TagsQuotes />
    </tags-containers>
  </div>
</template>

<script setup lang="ts">
import TagsContainers from 'src/components/TagsList/TagsContainers.vue';
import TagsQuotes from 'src/components/TagsList/TagsQuotes.vue';
import TagsReferences from 'src/components/TagsList/TagsReferences.vue';
</script>

<style scoped></style>
