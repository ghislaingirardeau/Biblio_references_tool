<template>
  <q-card class="reference_tags">
    <q-card-section class="row justify-between items-center min-w-64">
      <div class="text-h6">{{ title }}</div>
      <q-icon
        :name="mdiPlusCircle"
        size="sm"
        color="primary"
        class="cursor-pointer"
        @click="createTag"
      />
    </q-card-section>

    <q-separator />

    <q-list dense bordered padding class="rounded-borders">
      <slot />
    </q-list>
  </q-card>
</template>

<script setup lang="ts">
import { mdiPlusCircle } from '@quasar/extras/mdi-v7';
import { useTagsStore } from 'src/stores/tags';

const TagsStore = useTagsStore();

const props = defineProps({
  title: {
    type: String,
    require: true,
  },
});

function createTag() {
  TagsStore.addTag(props.title!.toLowerCase() as Parameters<typeof TagsStore.addTag>[0], '');
}
</script>

<style scoped></style>
