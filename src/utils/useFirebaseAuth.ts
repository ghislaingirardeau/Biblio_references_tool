import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider } from 'src/boot/firebase';
import { useAuth } from 'src/stores/auth';

const authStore = useAuth();

export const useFirebaseAuth = {
  async signInWithGoogle(router: any) {
    try {
      await signInWithPopup(auth, provider);
      await router.push({ name: 'references' });
    } catch (error) {
      console.error("Erreur d'authentification :", error);
    }
  },

  async logout(router: any) {
    await signOut(auth);
    await router.push({ name: 'guest' });
    console.log('Utilisateur déconnecté');
  },
};
