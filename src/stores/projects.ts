import { defineStore } from 'pinia';
import type { Project } from 'src/types/projects';
import type { Tags } from 'src/types/tags';

import { computed, ref, watch, type Ref } from 'vue';
import { referencesTemplate } from 'src/utils/useBaseReferences';
import { useStorage } from '@vueuse/core';
import { saveDataFirestore, saveProjectFirestore } from 'src/utils/useFirestore';

export const useProjectsStore = defineStore('ProjectsStore', () => {
  const projectTemplate: Ref<Project> = ref({
    id: `project-${Date.now()}`,
    label: 'Default',
    name: 'default',
    created_at: Date.now(),
    references: referencesTemplate,
    onEdited: false,
    onWork: true,
    tags: {
      references: [],
      quotes: [],
    },
  });

  const projects: Ref<Project[]> = useStorage('projects', [projectTemplate.value]);

  // JUST NEED TO SET projectId to a new id, to switch project automaticly
  const projectId = ref(projectTemplate.value.id);
  const userHasToSave = ref(false);
  const refreshKey = ref(0);

  const project = computed(() => projects.value.find((p) => p.id === projectId.value));

  const projectsLabel = computed(() =>
    projects.value.map((p) => {
      return { id: p.id, label: p.label, onEdited: p.onEdited };
    }),
  );

  async function add(label: string) {
    try {
      projectTemplate.value.label = label;
      projectTemplate.value.id = `project-${Date.now()}`;
      projectTemplate.value.created_at = Date.now();
      await saveProjectFirestore(projectTemplate.value);
      projects.value.push(projectTemplate.value);
    } catch (error) {
      console.log(error);
    }
  }

  function loadProjectsFromFirestore(projectsFromFirestore: Project[]) {
    console.log('load projects and change project id', projectsFromFirestore[0]!.id);
    projects.value = projectsFromFirestore;
    projectId.value = projectsFromFirestore[0]!.id;
    console.log('The current project is ', project.value);
  }

  function edit(id: string, label: string) {
    const foundProject = projects.value.find((p) => p.id === id);
    if (foundProject) {
      foundProject.label = label;
      foundProject.onEdited = false;
    }
  }

  function addTagToProject(type: 'references' | 'quotes', tag: string) {
    const foundProject = projects.value.find((p) => p.id === projectId.value);
    foundProject?.tags?.[type as keyof Tags].unshift(tag);
  }

  function enableEdit(id: string) {
    const foundProject = projects.value.find((p) => p.id === id);
    if (foundProject) {
      foundProject.onEdited = true;
    }
  }

  async function remove(id: string) {
    projects.value = projects.value.filter((p) => p.id !== id);
    await saveDataFirestore();
  }

  function resetProjects() {
    projects.value = [projectTemplate.value];
  }

  // watch(
  //   () => projects.value,
  //   () => {
  //     userHasToSave.value = true;
  //   },
  //   { deep: true },
  // );

  return {
    projectId,
    projects,
    projectTemplate,
    project,
    projectsLabel,
    loadProjectsFromFirestore,
    add,
    edit,
    remove,
    enableEdit,
    resetProjects,
    addTagToProject,
    userHasToSave,
    refreshKey,
  };
});
