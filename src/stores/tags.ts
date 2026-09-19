import { defineStore, storeToRefs } from 'pinia';
import { computed, ref, type Ref } from 'vue';
import type { Tags } from 'src/types/tags';
import { useProjectsStore } from './projects';

const ProjectsStore = useProjectsStore();
const { project } = storeToRefs(ProjectsStore);

export const useTagsStore = defineStore('TagsStore', () => {
  const tags: Ref<Tags> = computed(() => project.value!.tags);

  const tagsReference: Ref<string[]> = computed(() => project.value!.tags.references);
  const tagsQuote: Ref<string[]> = computed(() => project.value!.tags.quotes);

  const treeTagsView: Ref<any[]> = computed(() => {
    return [
      {
        label: 'Tags for References',
        selectable: false,
        children: tagsReference.value.map((r) => {
          return {
            label: r,
          };
        }),
      },
      {
        label: 'Tags for Quotes',
        selectable: false,
        children: tagsQuote.value.map((r) => {
          return {
            label: r,
          };
        }),
      },
    ];
  });

  function addTag(type: keyof Tags, name: string) {
    const isTagExist = project.value!.tags[type].findIndex((tag) => tag === name.toLowerCase());
    if (isTagExist === -1) {
      project.value!.tags[type].push(name);
    } else {
      return 'This tag exist already';
    }
  }

  return { tags, tagsReference, tagsQuote, addTag, treeTagsView };
});
