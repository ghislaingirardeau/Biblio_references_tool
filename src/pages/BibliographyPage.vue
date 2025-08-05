<template>
  <q-page class="p-2">
    my biblio display

    <div v-for="(referenceType, i) in project?.references" :key="i">
      <div v-if="referenceType?.lists.length">
        <p class="font-bold p-2">
          {{ referenceType!.type }}
        </p>
        <div v-if="referenceType!.type === 'books'">
          <BooksItem :references="referenceType.lists" @modalEdit="modalEdit" />
        </div>
        <div v-if="referenceType!.type === 'articles'">
          <ArticlesItem :references="referenceType.lists" @modalEdit="modalEdit" />
        </div>
      </div>
    </div>
    <EditModal
      v-model:showEditModal="showEditModal"
      v-model:selectedReference="selectedReference"
    />
  </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import ArticlesItem from 'src/components/bibliography/ArticlesItem.vue';
import BooksItem from 'src/components/bibliography/booksItem.vue';
import EditModal from 'src/components/EditModal.vue';
import { useProjectsStore } from 'src/stores/projects';
import type { Article, Book } from 'src/types/books';
import { computed, ref } from 'vue';

const ProjectsStore = useProjectsStore();
const { project } = storeToRefs(ProjectsStore);

const showEditModal = ref(false);
const selectedReference = ref<Book | Article>({ id: null });

function modalEdit(reference: Article | Book) {
  showEditModal.value = true;
  selectedReference.value = reference;
}
</script>

<style scoped></style>
