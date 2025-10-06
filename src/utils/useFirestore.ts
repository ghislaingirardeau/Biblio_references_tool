import { getFirestore, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { Notify } from 'quasar';
import { useAuth } from 'src/stores/auth';
import { useProjectsStore } from 'src/stores/projects';

// Initialiser Firestore
const db = getFirestore();

export async function updateDataFirestore() {
  const authStore = useAuth();

  if (authStore.user && authStore.user?.uid) {
    const userDocRef = doc(db, 'users', authStore.user.uid);
    // Vérification du type basée sur les propriétés distinctives
    await updateDoc(userDocRef, { projects: null });
  }
}

// Set firestore pour un nouvel utilisateur
export async function setUserFirestore() {
  console.log('set firestore id');
  const authStore = useAuth();
  const userDocRef = doc(db, 'users', authStore.user!.uid!);
  const docSnap = await getDoc(userDocRef);
  // Vérification si le document existe déjà
  console.log(docSnap);
  if (docSnap.data()) return { isNewUser: false };
  // Sinon, on le crée avec les données par défaut
  const ProjectsStore = useProjectsStore();
  console.log(ProjectsStore.projects);
  await setDoc(doc(db, 'users', authStore.user!.uid!), {
    projects: ProjectsStore.projects,
  });
  return { isNewUser: true };
}
