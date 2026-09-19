<template>
  <div>
    <q-input ref="filterRef" filled v-model="filter" label="Filter">
      <template v-slot:append>
        <q-icon v-if="filter !== ''" name="clear" class="cursor-pointer" @click="resetFilter" />
      </template>
    </q-input>
    <q-tree
      :nodes="tree"
      node-key="label"
      :filter="filter"
      v-model:expanded="expandedKeys"
      selected-color="primary"
      class="cursor-pointer"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { QInput, type QTreeNode } from 'quasar';
import { useTagsStore } from 'src/stores/tags';
import { computed, ref, useTemplateRef } from 'vue';

const tagsStore = useTagsStore();
const { treeReferencesTags } = storeToRefs(tagsStore);

const props = defineProps<{
  treeTags: QTreeNode[];
}>();

const filter = ref('');
const filterRef = useTemplateRef<QInput>('filterRef');
const expandedKeys = ref(['References']);

const tree = computed<QTreeNode[]>(() => props.treeTags);

function resetFilter() {
  filter.value = '';
  filterRef.value!.focus();
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
