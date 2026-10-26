import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export const useSearchStore = defineStore('SearchBiblio', () => {
  const router = useRouter();
  const route = useRoute();

  const query = ref('');
  const message = ref<null | string | undefined>(null);

  async function restore() {
    query.value = '';
    // Route from tag, so with one reference. Removing query with routing => restore filter
    if (route.query.id) {
      await restoreRemovingQuery(!!route.params.id);
    }
    message.value = null;
  }

  async function restoreRemovingQuery(isRouteQuotes: boolean) {
    if (isRouteQuotes) {
      await router.push({
        name: 'quotes-id',
        params: { type: route.params.type, id: route.params.id },
      });
    } else {
      await router.push({ name: 'references-type', params: { type: route.params.type } });
    }
  }

  return { query, message, restore, restoreRemovingQuery };
});
