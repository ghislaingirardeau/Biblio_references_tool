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
              v-for="(project, index) in menuItem.detail"
              :key="project.id"
              class="ml-4 cursor-pointer"
            >
              <q-item-section :class="{ 'text-indigo-800': isCurrentProjectOpened(project.id) }">
                <q-input
                  v-model="project.label"
                  dense
                  :ref="inputRefs.set"
                  :readonly="!project.onEdited"
                  @blur="editProject(project.id, project.label)"
                  @keyup.enter="$event.target.blur()"
                  @click="switchProject(project.id)"
                  :class="{ 'menu-projects-input': !isCurrentProjectOpened(project.id) }"
                >
                  <template v-slot:prepend>
                    <q-icon
                      :name="
                        isCurrentProjectOpened(project.id) ? mdiFolderOpenOutline : mdiFolderOutline
                      "
                      :class="{ 'cursor-pointer': !isCurrentProjectOpened(project.id) }"
                      :color="isCurrentProjectOpened(project.id) ? 'primary' : 'grey-6'"
                      @click="switchProject(project.id)"
                    />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      :name="project.onEdited ? mdiCheckCircleOutline : mdiFolderEditOutline"
                      color="primary"
                      class="cursor-pointer"
                      @click="handleActions(project.onEdited, project.id, project.label, index)"
                    />
                  </template>
                </q-input>
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
import { computed, ref, watch } from 'vue';
import TheFooter from 'src/components/TheFooter.vue';
import TheHeader from 'src/components/TheHeader.vue';
import ReferenceModal from 'src/components/ReferenceModal.vue';
import { useRoute } from 'vue-router';
import { useProjectsStore } from 'src/stores/projects';
import {
  mdiCheckCircleOutline,
  mdiFolderEditOutline,
  mdiFolderOpenOutline,
  mdiFolderOutline,
} from '@quasar/extras/mdi-v7';
import { storeToRefs } from 'pinia';
import { useTemplateRefsList } from '@vueuse/core';

const ProjectsStore = useProjectsStore();
const { projectsLabel, currentProject } = storeToRefs(ProjectsStore);

const inputRefs = useTemplateRefsList<HTMLInputElement>();
const isProjectOnEditing = ref(false);

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

const route = useRoute();

const modalMode = computed(() => {
  return route.params?.id ? 'quote' : 'reference';
});

function showModalProject() {
  ProjectsStore.add('new project');
}

function switchProject(id: string) {
  if (isProjectOnEditing.value) return;
  currentProject.value = id;
  leftDrawerOpen.value = false;
}

function handleActions(onEdited: boolean, id: string, label: string, index: number) {
  console.log('handle action', onEdited);
  if (!onEdited) {
    isProjectOnEditing.value = true;
    ProjectsStore.enableEdit(id);
    setTimeout(() => {
      inputRefs.value[index]?.focus();
    }, 50);
  } else {
    inputRefs.value[index]?.blur();
  }
}

function editProject(id: string, label: string) {
  ProjectsStore.edit(id, label);
  isProjectOnEditing.value = false;
}
</script>

<style lang="scss" scoped>
:deep() {
  .menu-projects-input {
    &.q-field--readonly.q-field--float .q-field__native {
      cursor: pointer !important;
    }
  }
}
</style>
