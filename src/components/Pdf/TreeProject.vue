<template>
  <div class="q-pa-md q-gutter-sm">
    <q-tree :nodes="simple" dense node-key="label" v-model:expanded="expanded" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const expanded = ref(['Satisfied customers (with avatar)', 'Good food (with icon)']);

const simple = [
  {
    label: 'Satisfied customers (with avatar)',
    avatar: '',
    children: [
      {
        label: 'Good food (with icon)',
        children: [{ label: 'Quality ingredients' }, { label: 'Good recipe' }],
      },
      {
        label: 'Good service (disabled node with icon)',
        children: [{ label: 'Prompt attention' }, { label: 'Professional waiter' }],
      },
      {
        label: 'Pleasant surroundings (with icon)',
        children: [
          {
            label: 'Happy atmosphere (with image)',
          },
          { label: 'Good table presentation' },
          { label: 'Pleasing decor' },
        ],
      },
    ],
  },
];
</script>
