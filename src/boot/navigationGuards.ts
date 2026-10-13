import { boot } from 'quasar/wrappers';
import { useAuth } from 'src/stores/auth';
import { useProjectsStore } from 'src/stores/projects';
import { useQuotesStore } from 'src/stores/quotes';
import { useReferencesStore } from 'src/stores/references';
import type { References } from 'src/types/references';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files

/* BOOT FILE:
A utiliser un peu comme un systeme de plugins pour ajouter une route guard, injecter des variables globalement, rediriger, gérer une authentification...
Pourquoi ? parce que pas de fichier mains.js Vue 3. Donc si on veut ajouter des choses comme on le ferait dans vue 3, on va passer par le boot file
*/

export default boot(({ app, router, redirect, store }) => {
  router.afterEach((to, from) => {
    const ReferencesStore = useReferencesStore();
    const QuotesStore = useQuotesStore();
    if (to.name === 'references-type') ReferencesStore.resetFilter();
    if (to.name === 'quotes-id') QuotesStore.resetQuoteFilter();
  });
  router.beforeEach((to, from) => {
    // verifie si un utilisateur est deja connecté, sinon redirige vers la route "guest"
    const Auth = useAuth();
    if (!Auth.user && to.name !== 'guest') {
      redirect('/guest');
    }
    // if hot reload on 'references' => OK
    if (!from.name && to.name === 'references') {
      return;
    }
    // if navigation between route name => OK
    if (from.name && to.name) return;
    // if hot reload and not on 'reference', redirect to home page
    if (!from.name) {
      redirect('/');
    }
  });
});
