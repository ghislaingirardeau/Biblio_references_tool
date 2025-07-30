<template>
  <div class="flex q-gutter-y-sm" v-if="editReference">
    <div
      v-for="reference in Object.keys(editReference)"
      :key="reference"
      class="fit row wrap justify-start items-start content-start"
    >
      <div v-if="Array.isArray((editReference as any)[reference])" class="w-full">
        <div v-for="(item, idx) in (editReference as any)[reference]" :key="idx" class="w-full">
          <q-input
            filled
            v-model="(editReference as any)[reference][idx]"
            class="mb-2"
            :label="`${reference} ${idx + 1}`"
          />
        </div>
        <q-btn
          flat
          color="primary"
          icon="add"
          @click="(editReference as any)[reference].push(`New ${reference}`)"
          :label="`add ${reference}`"
        />
      </div>
      <div v-else class="w-full">
        <q-input
          class="w-full"
          filled
          v-model="(editReference as any)[reference]"
          :label="reference"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Thesis } from 'src/types/books';
import type { References } from 'src/types/references';
import { referencesTemplate } from 'src/utils/useBaseReferences';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const editReference = defineModel<Thesis>('editReference');

const route = useRoute();

/* 
Recuperer le template
ajoute les boutons de maniere dynamique pour la saisie
le type doit correspondre au parametre de la page
*/
</script>

<style scoped></style>
