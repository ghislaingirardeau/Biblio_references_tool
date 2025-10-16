import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';
import { auth } from 'src/boot/firebase';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { setUserFirestore } from 'src/utils/useFirestore';
import { useRouter } from 'vue-router';
import { useProjectsStore } from './projects';

export const useAuth = defineStore(
  'auth',
  () => {
    const user = ref<Partial<User> | null>(null);
    const loggedIn = ref(false);
    const loggedOut = ref(true);
    const isFetchingData = ref(false);
    const router = useRouter();
    const ProjectsStore = useProjectsStore();
    const { userHasToSave } = storeToRefs(ProjectsStore);

    // Écouter les changements d'état d'authentification
    onAuthStateChanged(auth, (firebaseUser) => {
      // si connecter ou si la persitence de connection est assuré
      // sinon cel aveut dire qu'aucun user n'est connecté
      if (firebaseUser) {
        isFetchingData.value = true;
        const { uid, displayName, email } = firebaseUser;
        user.value = { uid, displayName, email };
        loggedIn.value = true;
        loggedOut.value = false;

        // Exécuter du code async sans rendre le callback async
        void (async () => {
          await setUserFirestore();
          await router.push({ name: 'references' });
          userHasToSave.value = false;
        })();
      } else {
        user.value = null;
        loggedIn.value = false;
        loggedOut.value = true;
      }
    });

    return {
      user,
      loggedIn,
      loggedOut,
      isFetchingData,
    };
  },
  {
    persist: true,
  },
);
