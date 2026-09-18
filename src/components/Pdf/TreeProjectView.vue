<template>
  <div class="q-pa-md q-gutter-sm">
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
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { QInput, type QTreeNode } from 'quasar';
import { useTreeStore } from 'src/stores/tree';
import { computed, ref, useTemplateRef } from 'vue';

const treeStore = useTreeStore();
const { treeProjectView } = storeToRefs(treeStore);

const filter = ref('');
const filterRef = useTemplateRef<QInput>('filterRef');
const expandedKeys = ref(['References']);

const tree = computed<QTreeNode[]>(() => treeProjectView.value as unknown as QTreeNode[]);

function resetFilter() {
  filter.value = '';
  filterRef.value!.focus();
}
</script>
