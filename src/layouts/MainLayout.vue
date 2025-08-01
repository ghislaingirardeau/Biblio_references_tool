<template>
  <q-layout view="hHh lpR fFf">
    <TheHeader v-model:leftDrawerOpen="leftDrawerOpen" />

    <q-drawer v-model="leftDrawerOpen" side="left" overlay bordered>
      <q-list>
        <template v-for="(menuItem, index) in menuList" :key="index">
          <q-separator />
          <q-item exact :to="menuItem.to ? menuItem.to : null" active-class="text-primary">
            <!-- <q-item-section avatar>
              <q-icon :name="menuItem.icon" />
            </q-item-section> -->
            <q-item-section>
              {{ menuItem.label.toUpperCase() }}
            </q-item-section>
            <q-item-section avatar v-if="menuItem.detail">
              <q-icon color="primary" name="add" @click="showModalProject" />
            </q-item-section>
          </q-item>
          <div v-if="menuItem.detail">
            <q-item
              v-for="project in menuItem.detail"
              :key="project.id"
              class="ml-4 cursor-pointer"
            >
              <q-item-section avatar>
                <q-icon
                  :name="
                    isCurrentProjectOpened(project.id) ? mdiFolderOpenOutline : mdiFolderOutline
                  "
                  :class="{ 'text-indigo-800': isCurrentProjectOpened(project.id) }"
                  @click="switchProject(project.id)"
                />
              </q-item-section>
              <q-item-section :class="{ 'text-indigo-800': isCurrentProjectOpened(project.id) }">
                <q-input v-if="project.onEdited" v-model="projectNewName" dense>
                  <template v-slot:append>
                    <q-icon
                      :name="mdiCheckCircleOutline"
                      color="primary"
                      @click="editProjectName(project.id)"
                      class="cursor-pointer"
                    />
                  </template>
                </q-input>
                <span v-else>{{ project.label }}</span>
              </q-item-section>
            </q-item>
          </div>
        </template>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <TheFooter />
    <ReferenceModal :modalMode="modalMode" />
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import TheFooter from 'src/components/TheFooter.vue';
import TheHeader from 'src/components/TheHeader.vue';
import ReferenceModal from 'src/components/ReferenceModal.vue';
import { useRoute } from 'vue-router';
import { useProjectsStore } from 'src/stores/projects';
import {
  mdiCheckCircleOutline,
  mdiFolderOpenOutline,
  mdiFolderOutline,
} from '@quasar/extras/mdi-v7';
import { storeToRefs } from 'pinia';

const ProjectsStore = useProjectsStore();
const { projectsLabel, currentProject } = storeToRefs(ProjectsStore);

function isCurrentProjectOpened(id: string) {
  return currentProject.value === id;
}

const menuList = computed(() => {
  return [
    // {
    //   label: 'Home',
    //   to: { name: 'references' },
    // },
    {
      label: 'Biblio',
      to: { name: 'bibliography' },
    },
    {
      label: 'Projects',
      to: { name: 'references' },
      detail: [...projectsLabel.value],
    },
  ];
});

const leftDrawerOpen = ref(false);
const projectNewName = ref('new project');

const route = useRoute();

const modalMode = computed(() => {
  return route.params?.id ? 'quote' : 'reference';
});

function showModalProject() {
  ProjectsStore.add('new project');
}

function switchProject(id: string) {
  currentProject.value = id;
  leftDrawerOpen.value = false;
}

function editProjectName(id: string) {
  console.log('name validation', projectNewName.value, id);
  ProjectsStore.edit(id, projectNewName.value);
}
</script>
