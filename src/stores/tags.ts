import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

export const useTagsStore = defineStore('TagsStore', () => {
  const tags = ref<string[]>([]);
  const tagsQuote = ref<string[]>([]);

  function add(tag: string) {
    if (tags.value.includes(tag)) return;
    tags.value.unshift(tag);
  }

  function addTagQuote(tag: string) {
    if (tagsQuote.value.includes(tag)) return;
    tagsQuote.value.unshift(tag);
  }

  return {
    tags,
    tagsQuote,
    add,
    addTagQuote,
  };
});
