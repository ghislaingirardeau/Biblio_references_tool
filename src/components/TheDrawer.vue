<template>
  <q-drawer v-model="leftDrawerOpen!" side="left" overlay bordered>
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
</template>

<script setup lang="ts">
import { useProjectsStore } from 'src/stores/projects';
import {
  mdiCheckCircleOutline,
  mdiFolderEditOutline,
  mdiFolderOpenOutline,
  mdiFolderOutline,
  mdiTrashCan,
} from '@quasar/extras/mdi-v7';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useTemplateRefsList } from '@vueuse/core';

const ProjectsStore = useProjectsStore();
const { projectsLabel, currentProject, userHasToSave } = storeToRefs(ProjectsStore);
const router = useRouter();

const leftDrawerOpen = defineModel<boolean>('leftDrawerOpen');
const showConfirmModal = defineModel<boolean>('showConfirmModal');

const isProjectOnEditing = ref(false);
const selectedFolder = ref<null | string>(null);
const inputRefs = useTemplateRefsList<HTMLInputElement>();

const menuList = computed(() => {
  return [
    {
      label: 'Projects',
      to: { name: 'references' },
      detail: [...projectsLabel.value],
    },
    {
      label: 'Bibliography',
      to: { name: 'bibliography' },
    },
  ];
});

function isCurrentProjectOpened(id: string) {
  return currentProject.value === id;
}

async function showModalProject() {
  await ProjectsStore.add('new project');
}

async function switchProject(id: string) {
  if (isProjectOnEditing.value) return;
  currentProject.value = id;
  leftDrawerOpen.value = false;
  userHasToSave.value = false;
  await router.push({ name: 'references' });
}

function editProject(id: string, label: string) {
  ProjectsStore.edit(id, label);
  isProjectOnEditing.value = false;
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
