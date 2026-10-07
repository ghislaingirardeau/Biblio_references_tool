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
import { useReferencesStore } from 'src/stores/references';
import type { Project, Projects } from 'src/types/projects';
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
  const ReferencesStore = useReferencesStore();

  const hasProjects = await loadProjectsFirestore();

  if (!hasProjects) {
    // if no projects from firestore, set default one (template) & loaded
    const ProjectsStore = useProjectsStore();
    await saveProjectFirestore(ProjectsStore.projectTemplate);
    ProjectsStore.loadProjectsFromFirestore([ProjectsStore.projectTemplate], true);

    Notify.create({
      message: 'User data set',
      color: 'secondary',
      icon: mdiContentSaveCheck,
      timeout: 3000,
    });
  } else {
    // Load references only if projects exist, because if no default projects => no references
    await ReferencesStore.loadReferences();
  }

  return true;
}

/* PROJECTS */

export async function saveProjectFirestore(project: Project) {
  const uid = getUid();

  console.log('new project is saved');

  const referencesCollection = doc(db, 'users', uid, 'projects', project.id);

  await setDoc(referencesCollection, project);
}

export async function loadProjectsFirestore() {
  const uid = getUid();

  const referencesCollection = collection(db, 'users', uid, 'projects');

  const q = query(referencesCollection);

  const snapshot = await getDocs(q);

  const data = snapshot.docs.map((doc) => ({
    ...doc.data(),
  }));

  console.log('all projects is loaded');

  if (data.length > 0) {
    // User has already a default project minimum set
    const ProjectsStore = useProjectsStore();
    ProjectsStore.loadProjectsFromFirestore(data as Project[], false);
    return true;
  } else {
    return false;
  }
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

  const q = query(quotesCollection, where('reference_id', '==', encodeURIComponent(referenceId)));

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

  const referencesRef = doc(db, 'users', uid, 'quotes', quote.id!);

  await setDoc(referencesRef, quote);
};

export const updateQuoteFirestore = async (quote: Quote) => {
  const uid = getUid();

  console.log(quote.id);

  const quotesDoc = doc(db, 'users', uid, 'quotes', quote.id!);

  await setDoc(quotesDoc, quote);
};

export const removeQuoteFirestore = async (quoteId: string) => {
  const uid = getUid();

  await deleteDoc(doc(db, 'users', uid, 'quotes', quoteId));
};
