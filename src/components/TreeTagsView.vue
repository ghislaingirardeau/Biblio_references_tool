<template>
  <div>
    <q-input ref="filterRef" filled v-model="filter" label="Filter">
      <template v-slot:append>
        <q-icon v-if="filter !== ''" name="clear" class="cursor-pointer" @click="resetFilter" />
      </template>
    </q-input>
    <q-tree :nodes="tree" node-key="label" default-expand-all :filter="filter">
      <template #default-header="prop">
        <div class="row items-center justify-between full-width">
          <div
            v-if="prop.node.label.length"
            class="cursor-pointer"
            @click="sendFilterTagToStore($event, prop.node.label)"
          >
            {{ prop.node.label }}
          </div>
          <q-input v-else autofocus dense v-model="newTag" @blur="createTag($event)"></q-input>
          <q-icon
            v-if="!prop.node.children"
            :name="mdiMinus"
            color="negative"
            class="q-mr-sm cursor-pointer"
            @click="deleteTag(prop.node.label, $event)"
          />
          <q-icon
            v-else
            :name="mdiPlus"
            color="primary"
            class="q-mr-sm cursor-pointer"
            @click="createTag($event)"
          />
        </div>
      </template>
    </q-tree>
  </div>
</template>

<script setup lang="ts">
import { mdiMinus, mdiPlus } from '@quasar/extras/mdi-v7';
import { storeToRefs } from 'pinia';
import { QInput, type QTreeNode } from 'quasar';
import { useTagsStore } from 'src/stores/tags';
import type { Tags } from 'src/types/tags';
import { computed, ref, useTemplateRef } from 'vue';

const tagsStore = useTagsStore();

const props = defineProps<{
  treeTags: QTreeNode[];
  type: keyof Tags;
}>();

const filter = ref('');
const filterRef = useTemplateRef<QInput>('filterRef');

const tree = computed<QTreeNode[]>(() => props.treeTags);
const newTag = ref('');

function resetFilter() {
  filter.value = '';
  filterRef.value!.focus();
}

function deleteTag(label: string, e: Event) {
  e.stopPropagation();
  // remove for all the quotes OR not allowed if used ???
  console.log('remove the ', label, 'in ', props.type);
  tagsStore.removeTag(props.type, label);
}

function createTag(e: Event) {
  e.stopPropagation();
  newTag.value.length
    ? tagsStore.addTag(props.type, newTag.value)
    : tagsStore.addTag(props.type, '');
  newTag.value = '';
}

function sendFilterTagToStore(e: Event, label: string) {
  e.stopPropagation();
  tagsStore.filterProjectsWithTagReferences(props.type, label);
}
</script>

<style scoped lang="scss">
:deep() {
  .q-tree__arrow,
  .q-tree__spinner {
    font-size: 20px;
    color: teal;
  }
}
</style>
