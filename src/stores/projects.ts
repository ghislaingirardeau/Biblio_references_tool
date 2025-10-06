import { defineStore } from 'pinia';
import type { Project, Projects, Tags } from 'src/types/projects';
import { computed, ref, type Ref } from 'vue';
import { referencesTemplate } from 'src/utils/useBaseReferences';
import { useStorage } from '@vueuse/core';

export const useProjectsStore = defineStore('ProjectsStore', () => {
  const projects: Ref<Project[]> = useStorage('projects', [
    {
      id: `Project-${Date.now()}`,
      label: 'All',
      name: 'default',
      created_at: Date.now(),
      references: referencesTemplate,
      onEdited: false,
      tags: {
        references: [],
        quotes: [],
      },
    },
  ]);

  const currentProject = ref(projects.value[0]!.id);

  const project = computed(() => projects.value.find((p) => p.id === currentProject.value));

  const projectsLabel = computed(() =>
    projects.value.map((p) => {
      return { id: p.id, label: p.label, onEdited: p.onEdited };
    }),
  );

  function add(label: string) {
    projects.value.push({
      id: `Project-${Date.now()}`,
      label,
      created_at: Date.now(),
      references: referencesTemplate,
      onEdited: true,
      tags: {
        references: [],
        quotes: [],
      },
    });
  }

  function edit(id: string, label: string) {
    const foundProject = projects.value.find((p) => p.id === id);
    if (foundProject) {
      foundProject.label = label;
      foundProject.onEdited = false;
    }
  }

  function addTagToProject(type: 'references' | 'quotes', tag: string) {
    const foundProject = projects.value.find((p) => p.id === currentProject.value);
    console.log(foundProject);
    foundProject?.tags?.[type as keyof Tags].unshift(tag);
  }

  function enableEdit(id: string) {
    const foundProject = projects.value.find((p) => p.id === id);
    if (foundProject) {
      foundProject.onEdited = true;
    }
  }

  function remove(id: string) {
    projects.value = projects.value.filter((p) => p.id !== id);
  }

  function resetProjects() {
    projects.value = [
      {
        id: `Project-${Date.now()}`,
        label: 'All',
        created_at: Date.now(),
        references: referencesTemplate,
        onEdited: false,
        tags: {
          references: [],
          quotes: [],
        },
      },
    ];
  }

  return {
    currentProject,
    project,
    projectsLabel,
    add,
    edit,
    remove,
    enableEdit,
    resetProjects,
    addTagToProject,
  };
});
