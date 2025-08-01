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
              :key="project.name"
              class="ml-4 cursor-pointer"
            >
              <q-item-section avatar>
                <q-icon
                  :name="
                    isCurrentProjectOpened(project.name) ? mdiFolderOpenOutline : mdiFolderOutline
                  "
                  :class="{ 'text-indigo-800': isCurrentProjectOpened(project.name) }"
                  @click="switchProject(project.name)"
                />
              </q-item-section>
              <q-item-section :class="{ 'text-indigo-800': isCurrentProjectOpened(project.name) }">
                {{ project.label }}
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
import { mdiFolderOpenOutline, mdiFolderOutline } from '@quasar/extras/mdi-v7';
import { storeToRefs } from 'pinia';

const ProjectsStore = useProjectsStore();
const { projectsLabel, currentProject } = storeToRefs(ProjectsStore);

function isCurrentProjectOpened(name: string) {
  return currentProject.value === name;
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

const route = useRoute();

const modalMode = computed(() => {
  return route.params?.id ? 'quote' : 'reference';
});

function showModalProject() {
  console.log('show modal to add projects');
}

function switchProject(projectName: string) {
  currentProject.value = projectName;
  leftDrawerOpen.value = false;
}
</script>
