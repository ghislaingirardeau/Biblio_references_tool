import { defineStore, storeToRefs, acceptHMRUpdate } from 'pinia';
import { computed, ref, type Ref } from 'vue';
import type { Tags, TagType } from 'src/types/tags';
import { useProjectsStore } from './projects';
import type { BibliographicEntry, Quote } from 'src/types/references';
import { useQuotesStore } from './quotes';
import { getQuotesByTag, getReferencesByTags } from 'src/utils/useFirestore';

const ProjectsStore = useProjectsStore();
const { project } = storeToRefs(ProjectsStore);

const QuotesStore = useQuotesStore();

export const useTagsStore = defineStore('TagsStore', () => {
  const tagsReference: Ref<string[]> = computed(() => project.value!.tags.references);
  const tagsQuote: Ref<string[]> = computed(() => project.value!.tags.quotes);

  const resultTagFilter = ref({
    tag: '' as string,
    list: [] as BibliographicEntry[] | Quote[],
  });

  const quotesWithSpecificTag = ref({
    tag: '' as string,
    list: [] as Quote[],
  });

  const treeQuotesTags: Ref<any[]> = computed(() => {
    return [
      {
        label: 'Tags for Quotes',
        selectable: false,
        children: tagsQuote.value.map((r) => {
          return {
            label: r,
            selectable: true,
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
            selectable: true,
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

  async function filterTag(type: TagType, tag: string) {
    resultTagFilter.value = {
      tag,
      list: [],
    };

    let result;

    if (type === 'references') {
      result = await getReferencesByTags(tag);
      resultTagFilter.value.list = result as BibliographicEntry[];
    }
    if (type === 'quotes') {
      result = await getQuotesByTag(tag);
      resultTagFilter.value.list = result as Quote[];
    }
  }

  return {
    tagsReference,
    tagsQuote,
    addTag,
    removeTag,
    treeQuotesTags,
    treeReferencesTags,
    filterTag,
    resultTagFilter,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTagsStore, import.meta.hot));
}
