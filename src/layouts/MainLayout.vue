<template>
  <q-layout view="hHh lpR fFf">
    <TheHeader v-model:leftDrawerOpen="leftDrawerOpen" />

    <q-drawer v-model="leftDrawerOpen" side="left" overlay bordered>
      <q-list>
        <template v-for="(menuItem, index) in menuList" :key="index">
          <q-separator />
          <q-item exact :to="menuItem.to" active-class="text-primary">
            <!-- <q-item-section avatar>
              <q-icon :name="menuItem.icon" />
            </q-item-section> -->
            <q-item-section>
              {{ menuItem.label.toUpperCase() }}
            </q-item-section>
          </q-item>
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
import { useReferencesStore } from 'src/stores/references';
import TheFooter from 'src/components/TheFooter.vue';
import TheHeader from 'src/components/TheHeader.vue';
import ReferenceModal from 'src/components/ReferenceModal.vue';
import { useRoute } from 'vue-router';

const { references } = useReferencesStore();

const menuList = computed(() => {
  return Object.keys(references).map((ref) => ({ label: ref, to: { name: ref } }));
});

const leftDrawerOpen = ref(false);

const route = useRoute();

const modalMode = computed(() => {
  return route.params?.id ? 'quote' : 'reference';
});
</script>
