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
    const isFetchingData = ref(true);
    const router = useRouter();
    const ProjectsStore = useProjectsStore();

    async function setAllData() {
      try {
        const response = await setUserFirestore();
        if (response) {
          console.log('the current project is', ProjectsStore.project);
          await router.push({ name: 'references' });
        }
        isFetchingData.value = false;
      } catch (error) {
        console.log(error);
      }
    }

    // Écouter les changements d'état d'authentification
    onAuthStateChanged(auth, (firebaseUser) => {
      isFetchingData.value = true;
      // si connecter ou si la persitence de connection est assuré
      // sinon cel aveut dire qu'aucun user n'est connecté
      if (firebaseUser) {
        const { uid, displayName, email } = firebaseUser;
        user.value = { uid, displayName, email };
        loggedIn.value = true;
        loggedOut.value = false;

        console.log('user is log');

        // Exécuter du code async sans rendre le callback async
        void (async () => {
          await setAllData();
        })();
      } else {
        user.value = null;
        loggedIn.value = false;
        isFetchingData.value = false;
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
