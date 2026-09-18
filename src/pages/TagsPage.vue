<template>
  <q-page padding>
    <div class="row q-col-gutter-md q-pa-md">
      <div class="col-12 col-md-8">
        <q-card outlined class="full-height p-2">
          <TagsReferences />
        </q-card>
      </div>
      <div class="col-12 col-md-4">
        <q-card outlined class="full-height p-2">Tutorial d'aide et explications ici</q-card>
      </div>
    </div>
  </q-page>
  <!-- <div class="q-pa-md row items-start q-gutter-md">
    <tags-containers title="References">
      <TagsReferences />
    </tags-containers>

    <tags-containers title="Quotes">
      <TagsQuotes />
    </tags-containers>
  </div> -->
</template>

<script setup lang="ts">
import TagsContainers from 'src/components/TagsList/TagsContainers.vue';
import TagsQuotes from 'src/components/TagsList/TagsQuotes.vue';
import TagsReferences from 'src/components/TagsList/TagsReferences.vue';
</script>

<style scoped></style>
