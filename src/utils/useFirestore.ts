import { mdiContentSaveCheck, mdiContentSaveOff } from '@quasar/extras/mdi-v7';
import {
  getFirestore,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
  query,
  where,
} from 'firebase/firestore';
import { storeToRefs } from 'pinia';
import { Notify } from 'quasar';
import { useAuth } from 'src/stores/auth';
import { useProjectsStore } from 'src/stores/projects';
import type { Projects } from 'src/types/projects';
import type { BibliographicEntry, Quote } from 'src/types/references';

// Initialiser Firestore
const db = getFirestore();

const getUid = () => {
  const authStore = useAuth();
  const uid = authStore.user?.uid;

  if (!uid) {
    throw new Error('Utilisateur non authentifié');
  }

  return uid;
};

export async function saveDataFirestore() {
  const authStore = useAuth();

  if (authStore.user && authStore.user?.uid) {
    const userDocRef = doc(db, 'users', authStore.user.uid);
    // Vérification du type basée sur les propriétés distinctives
    const ProjectsStore = useProjectsStore();

    // update data
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

  if (!docSnap.exists()) {
    // créer le document utilisateur si celui-ci est nouveau
    await setDoc(doc(db, 'users', authStore.user!.uid!), {
      projects: ProjectsStore.projects,
    });

    return;
  }

  // Sinon extrait les projets
  const { projects } = docSnap.data() as Projects;

  if (projects) {
    ProjectsStore.loadProjectsFromFirestore(projects);

    return { isNewUser: false };
  }

  Notify.create({
    message: 'Data saved',
    color: 'secondary',
    icon: mdiContentSaveCheck,
    timeout: 3000,
  });
  return { isNewUser: true };
}

export async function testFirestore() {
  const authStore = useAuth();
  const uid = authStore.user?.uid;

  if (!uid) {
    return;
  }

  /* GET UNE SOUS COLLECTION */
  // const userCollectionRef = collection(db, 'users', uid, 'references');
  // const docSnap = await getDocs(userCollectionRef);
  // const references = docSnap.docs.map((doc) => ({
  //   id: doc.id,
  //   ...doc.data(),
  // }));

  // console.log(references);

  /* Attention toutefois : getDocs() récupère toutes les références une seule fois. Si tu veux que ton application reçoive automatiquement les nouvelles références ou les modifications en temps réel, il faut utiliser onSnapshot() à la place. */

  /* GET collection with WHERE */
  const res = await getReferencesByProject('123456');
  console.log(res);

  /* CREER UNE SOUS COLLECTION */
  // const referencesRef = doc(db, 'users', uid, 'references', 'bGnDTrd89nueNuAUQ3dN');

  // await addDoc(referencesRef, {});

  // console.log(docRef.id);

  /* UPDATE UNE SOUS COLLECTION */
  // await setDoc(referencesRef, {
  //   title: 'ghislain',
  //   author: 'girardeau',
  //   year: 2025,
  //   project_id: '123456',
  // });
}

const getReferencesByProject = async (projectId: string) => {
  const uid = getUid();

  const referencesCollection = collection(db, 'users', uid, 'references');

  const q = query(referencesCollection, where('project_id', '==', projectId));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

const getReferencesByTags = async (tag: string) => {
  const uid = getUid();

  const referencesCollection = collection(db, 'users', uid, 'references');

  const q = query(referencesCollection, where('tags', 'array-contains', tag));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

const saveReferenceFirestore = async (reference: BibliographicEntry) => {
  const uid = getUid();

  const referencesCollection = collection(db, 'users', uid, 'references', reference.id!);

  await addDoc(referencesCollection, reference);
};

const updateReferenceFirestore = async (reference: BibliographicEntry) => {
  const authStore = useAuth();
  const uid = authStore.user?.uid;

  if (!uid) {
    return;
  }

  const referencesDoc = doc(db, 'users', uid, 'references', reference.id!);

  await setDoc(referencesDoc, reference);
};

const getQuotesByReferences = async (referenceId: string) => {
  const uid = getUid();

  const quotesCollection = collection(db, 'users', uid, 'quotes');

  const q = query(quotesCollection, where('reference_id', '==', referenceId));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

const getQuotesByTags = async (tag: string) => {
  const uid = getUid();

  const quotesCollection = collection(db, 'users', uid, 'quotes');

  const q = query(quotesCollection, where('tags', 'array-contains', tag));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

const saveQuoteFirestore = async (quote: Quote) => {
  const uid = getUid();

  const referencesRef = collection(db, 'users', uid, 'quotes', quote.id!);

  await addDoc(referencesRef, quote);
};

const updateQuoteFirestore = async (quote: Quote) => {
  const uid = getUid();

  const quotesDoc = doc(db, 'users', uid, 'quote', quote.id!);

  await setDoc(quotesDoc, quote);
};
