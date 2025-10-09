import { mdiContentSaveCheck } from '@quasar/extras/mdi-v7';
import { getFirestore, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { Notify } from 'quasar';
import { useAuth } from 'src/stores/auth';
import { useProjectsStore } from 'src/stores/projects';

// Initialiser Firestore
const db = getFirestore();

export async function saveDataFirestore() {
  const authStore = useAuth();

  if (authStore.user && authStore.user?.uid) {
    const userDocRef = doc(db, 'users', authStore.user.uid);
    // Vérification du type basée sur les propriétés distinctives
    const ProjectsStore = useProjectsStore();
    // erase and update data
    await updateDoc(userDocRef, { projects: ProjectsStore.projects });
    Notify.create({
      message: 'Data saved',
      color: 'secondary',
      icon: mdiContentSaveCheck,
      timeout: 3000,
    });
  }
}

// Set firestore pour un nouvel utilisateur
export async function setUserFirestore() {
  const authStore = useAuth();
  const userDocRef = doc(db, 'users', authStore.user!.uid!);
  const docSnap = await getDoc(userDocRef);
  // Vérification si le document existe déjà
  if (docSnap.data()) return { isNewUser: false };
  // Sinon, on le crée avec les données par défaut
  const ProjectsStore = useProjectsStore();
  await setDoc(doc(db, 'users', authStore.user!.uid!), {
    projects: ProjectsStore.projects,
  });
  Notify.create({
    message: 'Data saved',
    color: 'secondary',
    icon: mdiContentSaveCheck,
    timeout: 3000,
  });
  return { isNewUser: true };
}
