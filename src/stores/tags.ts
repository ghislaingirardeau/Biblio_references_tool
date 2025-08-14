import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

export const useTagsStore = defineStore('TagsStore', () => {
  const tags = ref<string[]>([]);

  function add(tag: string) {
    if (tags.value.includes(tag)) return;
    tags.value.unshift(tag);
  }

  return {
    tags,
    add,
  };
});
