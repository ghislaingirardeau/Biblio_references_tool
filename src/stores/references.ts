import { defineStore, storeToRefs } from 'pinia';
import { computed, ref, type Ref } from 'vue';
import type { References } from 'src/types/references';
import type { ReferenceContent } from 'src/types/references';
import { referencesTemplate } from 'src/utils/useBaseReferences';
import { useProjectsStore } from './projects';

const ProjectsStore = useProjectsStore();
const { project } = storeToRefs(ProjectsStore);

export const useReferencesStore = defineStore('ReferencesStore', () => {
  const references: Ref<References> = computed(() => project.value!.references);

  const filterReferences = ref<Pick<References, 'books' | 'articles'>[] | null>(null);

  const referencesTypes = computed(() => {
    return Object.keys(references.value) as Array<keyof References>;
  });

  function resetReferences() {
    references.value = referencesTemplate;
  }

  function add(type: string, reference: ReferenceContent) {
    references.value[type as keyof References]?.lists.unshift(reference);
  }

  function find(type: string, id: string) {
    return references.value[type as keyof References]!.lists.find((ref) => ref.id === id);
  }

  function filter(type: string, query: string) {
    filterReferences.value = null;

    if (!query.trim()) {
      return;
    }
    const lowerQuery = query.toLowerCase();
    const findReferences = references.value[type as keyof References]!.lists.filter(
      (reference) =>
        reference.title!.toLowerCase().includes(lowerQuery) ||
        ('authors' in reference &&
          reference.authors.join(' ').toLowerCase().includes(lowerQuery)) ||
        reference.tag?.join(' ').toLowerCase().includes(lowerQuery),
    );
    if (findReferences.length === 0) {
      return 'Book not found';
    }
    filterReferences.value = findReferences as Pick<References, 'books' | 'articles'>[];
    return null;
  }

  function resetFilter() {
    filterReferences.value = null;
  }

  function getTitle(type: string, id: string) {
    return references.value[type as keyof References]!.lists.find((ref) => ref.id === id)?.title;
  }

  function remove(type: string, referenceId: string) {
    const findReferences = references.value[type as keyof References]?.lists.filter(
      (ref) => ref.id !== referenceId,
    );
    if (type === 'books') {
      references.value.books!.lists = findReferences as ReferenceContent[];
    } else if (type === 'articles') {
      references.value.articles!.lists = findReferences as ReferenceContent[];
    }
  }

  return {
    references,
    referencesTypes,
    getTitle,
    add,
    find,
    remove,
    resetReferences,
    filterReferences,
    filter,
    resetFilter,
  };
});
