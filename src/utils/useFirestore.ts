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
  deleteDoc,
} from 'firebase/firestore';
import { storeToRefs } from 'pinia';
import { Notify } from 'quasar';
import { useAuth } from 'src/stores/auth';
import { useProjectsStore } from 'src/stores/projects';
import type { Projects } from 'src/types/projects';
import type { BibliographicEntry, Quote } from 'src/types/references';

/* FIRESTORE:

- ApiUsage & Projects are field of users/userID
- References & Quotes are sub-collections of users/userID

*/

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
  console.log('is saving');
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
  const uid = getUid();

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
  const res = await getReferencesByProject('Project-1789463170877');
  console.log(res);

  /* CREER UNE SOUS COLLECTION */
  // const referencesRef = doc(db, 'users', uid, 'references', 'bGnDTrd89nueNuAUQ3dN');

  // await setDoc(referencesRef, {});

  // console.log(referencesRef.id);

  /* UPDATE UNE SOUS COLLECTION */
  // await setDoc(referencesRef, {
  //   title: 'ghislain',
  //   author: 'girardeau',
  //   year: 2025,
  //   project_id: '123456',
  // });
}

/* REFERENCES */

export const getReferencesByProject = async (projectId: string) => {
  const uid = getUid();

  const referencesCollection = collection(db, 'users', uid, 'references');

  const q = query(referencesCollection, where('project_id', '==', projectId));

  const snapshot = await getDocs(q);

  const result: Record<string, Array<BibliographicEntry>> = {};

  snapshot.docs.forEach((doc) => {
    const data = doc.data() as BibliographicEntry;
    const type = data.type;

    if (!result[type]) {
      result[type] = [];
    }

    result[type].push({
      ...data,
    });
  });

  return result;
};

export const getReferencesByTags = async (tag: string) => {
  const uid = getUid();

  const referencesCollection = collection(db, 'users', uid, 'references');

  const q = query(referencesCollection, where('tags', 'array-contains', tag));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const saveReferenceFirestore = async (reference: BibliographicEntry) => {
  const uid = getUid();

  const referencesCollection = doc(db, 'users', uid, 'references', reference.id!);

  await setDoc(referencesCollection, reference);
};

export const updateReferenceFirestore = async (reference: BibliographicEntry) => {
  const uid = getUid();

  const referencesDoc = doc(db, 'users', uid, 'references', reference.id!);

  await setDoc(referencesDoc, reference);
};

export const removeReferenceFirestore = async (referenceId: string) => {
  const uid = getUid();
  await deleteDoc(doc(db, 'users', uid, 'references', referenceId));
};

/* QUOTES */

export const getQuotesByReference = async (referenceId: string) => {
  const uid = getUid();

  const quotesCollection = collection(db, 'users', uid, 'quotes');

  const q = query(quotesCollection, where('reference_id', '==', referenceId));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    ...doc.data(),
  }));
};

export const getQuotesByTag = async (tag: string) => {
  const uid = getUid();

  const quotesCollection = collection(db, 'users', uid, 'quotes');

  const q = query(quotesCollection, where('tags', 'array-contains', tag));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const saveQuoteFirestore = async (quote: Quote) => {
  const uid = getUid();

  const referencesRef = collection(db, 'users', uid, 'quotes', quote.id!);

  await addDoc(referencesRef, quote);
};

export const updateQuoteFirestore = async (quote: Quote) => {
  const uid = getUid();

  const quotesDoc = doc(db, 'users', uid, 'quote', quote.id!);

  await setDoc(quotesDoc, quote);
};

export const removeQuoteFirestore = async (quoteId: string) => {
  const uid = getUid();
  await deleteDoc(doc(db, 'users', uid, 'references', quoteId));
};
