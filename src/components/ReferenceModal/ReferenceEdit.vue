<template>
  <div class="flex q-gutter-y-sm" v-if="editReference">
    <div
      v-for="reference in referenceInputsEditable"
      :key="reference"
      class="fit row wrap justify-start items-start content-start"
    >
      <div v-if="Array.isArray((editReference as any)[reference])" class="w-full">
        <div v-for="(item, idx) in (editReference as any)[reference]" :key="idx" class="w-full">
          <q-input
            filled
            v-model="(editReference as any)[reference][idx]"
            class="mb-2"
            :label="`${formatLabel(reference)} ${idx + 1}`"
          />
        </div>
        <q-btn
          flat
          color="primary"
          icon="add"
          @click="(editReference as any)[reference].push(`New ${reference}`)"
          :label="`add ${reference}`"
        />
      </div>
      <div v-else class="w-full">
        <q-input
          class="w-full"
          filled
          :disable="reference === 'id'"
          v-model="(editReference as any)[reference]"
          :label="formatLabel(reference)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'quasar';
import { computed } from 'vue';

const editReference = defineModel('editReference');

const { capitalize } = format;

function formatLabel(label: string) {
  return label
    .split('-')
    .map((e) => capitalize(e))
    .join(' ');
}

const referenceInputsEditable = computed(() => {
  const toArray = Object.keys(editReference.value ?? {});
  return toArray.filter((e) => e !== 'quotes');
});
</script>

<style scoped></style>
