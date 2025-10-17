<template>
  <q-layout view="hHh lpR fFf" :key="refreshKey">
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
                  @click="!project.onEdited ? switchProject(project.id) : null"
                  :class="{ 'menu-projects-input': !project.onEdited }"
                >
                  <template v-slot:prepend>
                    <q-icon
                      :name="
                        isCurrentProjectOpened(project.id) ? mdiFolderOpenOutline : mdiFolderOutline
                      "
                      :class="{ 'cursor-pointer': !isCurrentProjectOpened(project.id) }"
                      :color="isCurrentProjectOpened(project.id) ? 'primary' : 'grey-6'"
                      @click="!project.onEdited ? switchProject(project.id) : null"
                    />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      v-if="project.onEdited"
                      :name="mdiCheckCircleOutline"
                      color="primary"
                      class="cursor-pointer"
                      @click="editProject(project.id, project.label)"
                    />
                    <q-icon
                      v-else
                      :name="mdiFolderEditOutline"
                      color="primary"
                      class="cursor-pointer"
                      @click="
                        handleActions(project.onEdited, project.id, project.label, index, $event)
                      "
                    />
                    <q-icon
                      v-if="index > 0"
                      :name="mdiTrashCan"
                      :color="project.onEdited ? 'grey-6' : 'negative'"
                      class="cursor-pointer"
                      @click="askConfirmation(project.onEdited, project.id)"
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
    <ConfirmModal v-model:showConfirmModal="showConfirmModal" @confirm="deleteProject"
      ><template v-slot:message> Are you sure to delete this project ? </template>
    </ConfirmModal>
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
  mdiFolderEditOutline,
  mdiFolderOpenOutline,
  mdiFolderOutline,
  mdiMinus,
  mdiTrashCan,
} from '@quasar/extras/mdi-v7';
import { storeToRefs } from 'pinia';
import { useTemplateRefsList } from '@vueuse/core';
import ConfirmModal from 'src/components/ConfirmModal.vue';

const ProjectsStore = useProjectsStore();
const { projectsLabel, currentProject, userHasToSave, refreshKey } = storeToRefs(ProjectsStore);

const inputRefs = useTemplateRefsList<HTMLInputElement>();
const isProjectOnEditing = ref(false);
const showConfirmModal = ref(false);
const selectedFolder = ref<null | string>(null);

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

async function showModalProject() {
  await ProjectsStore.add('new project');
}

function switchProject(id: string) {
  if (isProjectOnEditing.value) return;
  currentProject.value = id;
  leftDrawerOpen.value = false;
  userHasToSave.value = false;
}

function handleActions(onEdited: boolean, id: string, label: string, index: number, e: Event) {
  isProjectOnEditing.value = true;
  ProjectsStore.enableEdit(id);
}

function askConfirmation(onEdited: boolean, id: string) {
  if (onEdited) return;
  showConfirmModal.value = true;
  selectedFolder.value = id;
}

async function deleteProject() {
  selectedFolder.value ? await ProjectsStore.remove(selectedFolder.value) : null;
  selectedFolder.value = null;
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
