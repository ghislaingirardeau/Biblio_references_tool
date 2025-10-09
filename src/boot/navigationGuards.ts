import { boot } from 'quasar/wrappers';
import { useAuth } from 'src/stores/auth';
import { useQuotesStore } from 'src/stores/quotes';
import { useReferencesStore } from 'src/stores/references';

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
    ReferencesStore.resetFilter();
    QuotesStore.resetQuoteFilter();
  });
  router.beforeEach((to, from) => {
    const ReferencesStore = useReferencesStore();
    // verifie si un utilisateur est deja connecté, sinon redirige vers la route "guest"
    const Auth = useAuth();
    console.log(Auth.user);
    if (!Auth.user && to.name !== 'guest') {
      redirect('/guest');
    }
    // si la route references-type ne correspond pas à une référence pré-défini, redirige vers l'accueil
    const typeParam = to.params.type;
    if (
      !typeParam ||
      ReferencesStore.referencesTypes.includes(typeParam as 'books' | 'articles' | 'web')
    ) {
      return;
    } else {
      redirect('/');
    }
  });
});
