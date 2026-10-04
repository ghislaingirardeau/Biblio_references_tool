import { defineStore, storeToRefs } from 'pinia';
import { computed, ref, type Ref } from 'vue';
import type { References } from 'src/types/references';
import type { BibliographicEntry } from 'src/types/references';
import { referencesTemplate } from 'src/utils/useBaseReferences';
import { useProjectsStore } from './projects';
import {
  getReferencesByProject,
  removeReferenceFirestore,
  saveDataFirestore,
  saveReferenceFirestore,
} from 'src/utils/useFirestore';

const ProjectsStore = useProjectsStore();
const { project } = storeToRefs(ProjectsStore);

export const useReferencesStore = defineStore('ReferencesStore', () => {
  const references: Ref<References> = computed(() => project.value!.references);

  const filterReferences = ref<Pick<References, 'books' | 'articles'>[] | null>(null);

  const loadingReferences = ref(false);
  const referencesBis = ref<Record<string, BibliographicEntry[]>>({});
  const referencesTypes = computed(() => {
    return Object.keys(references.value) as Array<keyof References>;
  });

  const referencesLabels = computed(() => {
    return referencesTypes.value.map((ref) => {
      return references.value[ref]?.label;
    });
  });

  function resetReferences() {
    references.value = referencesTemplate;
  }

  async function loadReferences(projectId: string) {
    loadingReferences.value = true;

    try {
      referencesBis.value = await getReferencesByProject(projectId);
    } finally {
      loadingReferences.value = false;
    }
  }

  async function add(type: string, reference: BibliographicEntry) {
    references.value[type as keyof References]?.lists.unshift(reference);
    // await saveDataFirestore();
    await saveReferenceFirestore(reference);
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
        reference.title.toLowerCase().includes(lowerQuery) ||
        ('authors' in reference &&
          reference.authors
            .map((a) => a.firstname + ' ' + a.lastname)
            .join(' ')
            .toLowerCase()
            .includes(lowerQuery)) ||
        reference.tags?.join(' ').toLowerCase().includes(lowerQuery),
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
    return referencesBis.value[type as keyof References]!.find((ref) => ref.id === id)?.title;
  }

  async function remove(type: string, referenceId: string) {
    const filterReferences = references.value[type as keyof References]?.lists.filter(
      (ref) => ref.id !== referenceId,
    );
    references.value[type as keyof References]!.lists = filterReferences as BibliographicEntry[];
    // await saveDataFirestore();
    await removeReferenceFirestore(referenceId);
  }

  return {
    references,
    referencesBis,
    referencesTypes,
    referencesLabels,
    getTitle,
    loadReferences,
    add,
    find,
    remove,
    resetReferences,
    filterReferences,
    filter,
    resetFilter,
  };
});
