import { defineStore } from 'pinia';
import type { Project, Projects } from 'src/types/projects';
import { computed, ref, type Ref } from 'vue';
import { referencesTemplate } from 'src/utils/useBaseReferences';
import { useStorage } from '@vueuse/core';

export const useProjectsStore = defineStore('ProjectsStore', () => {
  const projects: Ref<Project[]> = useStorage('projects', [
    {
      id: Date.now(),
      label: 'All references',
      name: 'default',
      created_at: Date.now(),
      references: referencesTemplate,
    },
  ]);

  const currentProject = ref('default');

  const project = computed(() => projects.value.find((p) => p.name === currentProject.value));

  const projectsLabel = computed(() =>
    projects.value.map((p) => {
      return { name: p.name, label: p.label };
    }),
  );

  function add(name: string, label: string) {
    projects.value.push({
      id: Date.now(),
      label,
      name,
      created_at: Date.now(),
      references: referencesTemplate,
    });
  }

  return {
    currentProject,
    project,
    projectsLabel,
    add,
  };
});
