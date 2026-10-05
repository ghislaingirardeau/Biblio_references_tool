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
  updateReferenceFirestore,
} from 'src/utils/useFirestore';

const ProjectsStore = useProjectsStore();
const { project, projectId } = storeToRefs(ProjectsStore);

export const useReferencesStore = defineStore('ReferencesStore', () => {
  const filterReferences = ref<Pick<References, 'books' | 'articles'>[] | null>(null);

  const loadingReferences = ref(false);
  const references = ref<Record<string, BibliographicEntry[]>>({});
  const referencesTypes = computed(() => {
    return Object.keys(project.value!.references) as Array<keyof References>;
  });

  const referencesLabels = computed(() => {
    return referencesTypes.value.map((ref) => {
      return project.value!.references[ref]?.label;
    });
  });

  async function loadReferences() {
    loadingReferences.value = true;

    try {
      references.value = await getReferencesByProject(projectId.value);
    } finally {
      loadingReferences.value = false;
    }
  }

  async function add(type: string, reference: BibliographicEntry) {
    references.value[type as keyof References]?.unshift(reference);
    await saveReferenceFirestore(reference);
  }

  async function update(reference: BibliographicEntry) {
    try {
      await updateReferenceFirestore(reference);
    } catch (error) {
      console.log(error);
    }
  }

  function filter(type: string, query: string) {
    filterReferences.value = null;

    if (!query.trim()) {
      return;
    }
    const lowerQuery = query.toLowerCase();
    const findReferences = references.value[type as keyof References]!.filter(
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
    return references.value[type as keyof References]!.find((ref) => ref.id === id)?.title;
  }

  async function remove(type: string, referenceId: string) {
    try {
      loadingReferences.value = true;
      await removeReferenceFirestore(referenceId);
      const filterReferences = references.value[type as keyof References]?.filter(
        (ref) => ref.id !== referenceId,
      );
      references.value[type as keyof References] = filterReferences as BibliographicEntry[];
    } catch (error) {
      console.log(error);
    } finally {
      loadingReferences.value = false;
    }
  }

  return {
    references,
    referencesTypes,
    referencesLabels,
    getTitle,
    loadingReferences,
    loadReferences,
    add,
    update,
    remove,
    filterReferences,
    filter,
    resetFilter,
  };
});
