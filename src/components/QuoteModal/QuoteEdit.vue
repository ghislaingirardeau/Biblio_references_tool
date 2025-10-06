<template>
  <div class="flex q-gutter-y-sm" v-if="editQuote">
    <q-input
      class="w-full"
      filled
      v-model="editQuote.page"
      label="Page"
      :readonly="ModalReference.isReadonly"
    />
    <q-select
      v-model="editQuote.tag"
      class="w-full"
      multiple
      use-chips
      use-input
      input-debounce="0"
      @new-value="createValue"
      :options="tagsFirstCapitalize"
      label="Tags"
    />
    <QuillEditor
      v-model:content="editQuote.content"
      theme="snow"
      content-type="html"
      class="quill-editor w-full border-2 border-gray-200 !mt-0 h-80"
      :readOnly="ModalReference.isReadonly"
    />
  </div>
</template>

<script setup lang="ts">
import { useModalReferenceStore } from 'src/stores/modalReferences';
import { useTagsStore } from 'src/stores/tags';
import type { Quote } from 'src/types/references';
import { computed, ref } from 'vue';
import { format } from 'quasar';

const editQuote = defineModel<Quote>('editQuote');

const { capitalize } = format;

const ModalReference = useModalReferenceStore();
const TagsStore = useTagsStore();

const tagsFirstCapitalize = computed(() => {
  return TagsStore.tagsQuote.map((tag) => capitalize(tag));
});

function createValue(
  val: string,
  done: (val: string, mode?: 'add-unique' | 'add' | 'toggle') => void,
) {
  TagsStore.addTagQuote(val.toLowerCase());
  done(capitalize(val.toLowerCase()), 'add-unique');
}
</script>

<style scoped></style>
