import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider } from 'src/boot/firebase';
import { useAuth } from 'src/stores/auth';

const authStore = useAuth();

export const useFirebaseAuth = {
  async signInWithGoogle() {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Erreur d'authentification :", error);
    }
  },

  async logout() {
    await signOut(auth);
    console.log('Utilisateur déconnecté');
  },
};
