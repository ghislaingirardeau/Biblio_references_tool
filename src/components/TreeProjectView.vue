<template>
  <q-card-section v-if="tree">
    <q-input ref="filterRef" filled v-model="filter" label="Filter">
      <template v-slot:append>
        <q-icon v-if="filter !== ''" name="clear" class="cursor-pointer" @click="resetFilter" />
      </template>
    </q-input>
    <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <q-tree
        :nodes="tree"
        node-key="label"
        :filter="filter"
        v-model:expanded="expandedKeys"
        selected-color="primary"
        class="cursor-pointer"
      />
    </transition>
  </q-card-section>
  <q-inner-loading :showing="loadingReferences || !tree">
    <q-spinner-gears size="50px" color="primary" />
  </q-inner-loading>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { QInput, type QTreeNode } from 'quasar';
import { useReferencesStore } from 'src/stores/references';
import { useTreeStore } from 'src/stores/tree';
import { computed, ref, useTemplateRef } from 'vue';

const treeStore = useTreeStore();
const { treeProjectView } = storeToRefs(treeStore);
const ReferencesStore = useReferencesStore();
const { loadingReferences } = storeToRefs(ReferencesStore);

const filter = ref('');
const filterRef = useTemplateRef<QInput>('filterRef');
const expandedKeys = ref(['References']);

const tree = computed<QTreeNode[]>(() => treeProjectView.value as unknown as QTreeNode[]);

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
