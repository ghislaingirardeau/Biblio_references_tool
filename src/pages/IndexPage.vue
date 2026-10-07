<template>
  <q-page padding>
    <div class="row q-col-gutter-md q-pa-md">
      <div class="col-12 col-md-8">
        <q-card outlined class="full-height p-2">
          <TreeProjectView />
        </q-card>
      </div>
      <div class="col-12 col-md-4">
        <q-card outlined class="full-height p-2"
          >Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi dolorum delectus,
          impedit error nisi, neque quibusdam molestiae optio eos minus enim, corporis quaerat
          asperiores sed soluta consectetur iusto! Possimus, vero.</q-card
        >
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import TreeProjectView from 'src/components/TreeProjectView.vue';
import { useAuth } from 'src/stores/auth';

const auth = useAuth();
</script>
