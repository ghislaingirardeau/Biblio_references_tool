import { defineStore, storeToRefs, acceptHMRUpdate } from 'pinia';
import { computed, ref, type Ref } from 'vue';
import type { Tags } from 'src/types/tags';
import { useProjectsStore } from './projects';
import { useReferencesStore } from './references';
import type { BibliographicEntry } from 'src/types/references';

const ProjectsStore = useProjectsStore();
const { project } = storeToRefs(ProjectsStore);

const ReferencesStore = useReferencesStore();
const { referencesTypes } = storeToRefs(ReferencesStore);

export const useTagsStore = defineStore('TagsStore', () => {
  const tags: Ref<Tags> = computed(() => project.value!.tags);

  const tagsReference: Ref<string[]> = computed(() => project.value!.tags.references);
  const tagsQuote: Ref<string[]> = computed(() => project.value!.tags.quotes);

  const referencesWithSpecificTag: Ref<BibliographicEntry[] | null> = ref(null);

  const treeQuotesTags: Ref<any[]> = computed(() => {
    return [
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

  const treeReferencesTags: Ref<any[]> = computed(() => {
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
    ];
  });

  function addTag(type: keyof Tags, name: string) {
    const tags = [...project.value!.tags[type]];
    // if name is '', it's an edit input empty, add to array to edit
    // if not empty, replace '' by the user tag name
    if (name.length) {
      const findEmptyTag = tags.indexOf('');
      tags[findEmptyTag] = name;
    } else {
      tags.push(name);
    }
    const uniqueTags = [...new Set(tags)];
    project.value!.tags[type] = uniqueTags;
  }

  function removeTag(type: keyof Tags, name: string) {
    project.value!.tags[type] = project.value!.tags[type].filter((n) => n !== name);

    // Use Filter() from store References to get all with the tags, map and delete
  }

  function filterProjectsWithTagReferences(type: keyof Tags, tag: string) {
    referencesWithSpecificTag.value = [];

    for (const key of referencesTypes.value) {
      const typeOfReferences = project.value?.references[key];
      // if there is no references type inside list array return
      if (!typeOfReferences?.lists.length) continue;
      const typesWithTags = typeOfReferences?.lists.filter((e) => {
        const findTag = e.tags!.find((t) => t.toLowerCase() === tag.toLowerCase());
        if (findTag) return true;
      });
      if (!typesWithTags.length) continue;
      referencesWithSpecificTag.value.push(...typesWithTags);
    }
  }

  return {
    tags,
    tagsReference,
    tagsQuote,
    addTag,
    removeTag,
    treeQuotesTags,
    treeReferencesTags,
    filterProjectsWithTagReferences,
    referencesWithSpecificTag,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTagsStore, import.meta.hot));
}
