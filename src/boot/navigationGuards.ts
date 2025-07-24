import { boot } from 'quasar/wrappers';
import { useReferencesStore } from 'src/stores/references';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files

/* BOOT FILE:
A utiliser un peu comme un systeme de plugins pour ajouter une route guard, injecter des variables globalement, rediriger, gérer une authentification...
Pourquoi ? parce que pas de fichier mains.js Vue 3. Donc si on veut ajouter des choses comme on le ferait dans vue 3, on va passer par le boot file
*/

export default boot(({ app, router, redirect }) => {
  router.afterEach((to, from) => {
    const ReferencesStore = useReferencesStore();
    ReferencesStore.resetFilter();
  });
  router.beforeEach((to, from) => {
    const ReferencesStore = useReferencesStore();
    const typeParam = to.params.type;
    if (!typeParam || ReferencesStore.types.includes(typeParam as 'books' | 'articles' | 'web')) {
      return;
    } else {
      redirect('/');
    }
  });
});
