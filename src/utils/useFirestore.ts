import { mdiContentSaveCheck, mdiContentSaveOff } from '@quasar/extras/mdi-v7';
import { getFirestore, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { storeToRefs } from 'pinia';
import { Notify } from 'quasar';
import { useAuth } from 'src/stores/auth';
import { useProjectsStore } from 'src/stores/projects';
import type { Projects } from 'src/types/projects';

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

    // remove badge on save icon
    const { userHasToSave } = storeToRefs(ProjectsStore);
    userHasToSave.value = false;

    Notify.create({
      message: 'Data saved',
      color: 'secondary',
      icon: mdiContentSaveCheck,
      timeout: 3000,
    });
  }
}

// Set firestore pour un nouvel utilisateur
// Si user already exist, load data from firestore on connection
// /!\ save store before logout !!!!!
export async function setUserFirestore() {
  const authStore = useAuth();
  const userDocRef = doc(db, 'users', authStore.user!.uid!);
  const docSnap = await getDoc(userDocRef);

  const ProjectsStore = useProjectsStore();
  const { projects } = docSnap.data() as Projects;

  // Vérification si le document existe déjà, si c'est le cas, charge les
  if (projects) {
    ProjectsStore.loadProjectsFromFirestore(projects);
    return { isNewUser: false };
  }
  // Sinon, on le crée avec les données par défaut
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
