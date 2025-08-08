<template>
  <div class="flex q-gutter-y-sm" v-if="editReference">
    <div
      v-for="reference in referenceInputsEditable"
      :key="reference"
      class="fit row wrap justify-start items-start content-start"
    >
      <div v-if="Array.isArray((editReference as any)[reference])" class="w-full">
        <div v-if="reference === 'tags'">
          <q-select
            v-model="tag"
            multiple
            use-chips
            use-input
            input-debounce="0"
            @new-value="createValue"
            :options="tagsFirstCapitalize"
            label="Tags"
          />
        </div>
        <div v-else>
          <div v-for="(item, idx) in (editReference as any)[reference]" :key="idx" class="flex">
            <q-input
              v-model="(editReference as any)[reference][idx].firstname"
              class="mb-2 w-1/2"
              :label="`${formatLabel(reference + (idx + 1) + ' ' + 'First name')}`"
            />
            <q-input
              v-model="(editReference as any)[reference][idx].lastname"
              class="mb-2 w-1/2"
              :label="`${formatLabel(reference + (idx + 1) + ' ' + 'Last name')}`"
            />
          </div>
          <q-btn
            flat
            color="primary"
            icon="add"
            @click="
              (editReference as any)[reference].push({ firstname: 'hello', lastname: 'world' })
            "
            :label="`add ${reference}`"
          />
        </div>
      </div>
      <div v-else class="w-full">
        <q-input
          class="w-full"
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
import { useTagsStore } from 'src/stores/tags';
import { computed, ref } from 'vue';

const editReference = defineModel('editReference');
const TagsStore = useTagsStore();

const tag = ref(null);

const { capitalize } = format;

const tagsFirstCapitalize = computed(() => {
  return TagsStore.tags.map((tag) => capitalize(tag));
});

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

function createValue(
  val: string,
  done: (val: string, mode?: 'add-unique' | 'add' | 'toggle') => void,
) {
  TagsStore.add(val.toLowerCase());
  done(capitalize(val.toLowerCase()), 'add-unique');
}
</script>

<style scoped></style>
