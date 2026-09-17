<template>
  <q-item v-for="(tag, index) in tagsReference" :key="index">
    <q-item-section v-if="tag.length"> {{ tag }} </q-item-section>
    <q-input v-else v-model="newTag" autofocus />
    <q-item-section side
      ><q-icon
        v-if="tag.length"
        :name="mdiTrashCan"
        size="sm"
        color="negative"
        class="cursor-pointer"
      />
      <q-icon
        v-else
        :name="mdiCheckCircleOutline"
        size="sm"
        color="primary"
        class="cursor-pointer"
      />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { mdiCheckCircleOutline, mdiTrashCan } from '@quasar/extras/mdi-v7';
import { storeToRefs } from 'pinia';
import { useTagsStore } from 'src/stores/tags';
import { ref } from 'vue';

const TagsStore = useTagsStore();
const { tagsReference } = storeToRefs(TagsStore);

const newTag = ref('');
</script>

<style scoped></style>
