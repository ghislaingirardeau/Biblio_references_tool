import { boot } from 'quasar/wrappers';
import { initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  setPersistence,
} from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

console.log('API key', process.env.APIKEY);

const firebaseConfig = {
  apiKey: process.env.APIKEY as string,
  authDomain: process.env.AUTH_DOMAIN as string,
  projectId: process.env.PROJECT_ID as string,
  storageBucket: process.env.STORAGE_BUCKET as string,
  messagingSenderId: process.env.MESSAGING_SENDER_ID as string,
  appId: process.env.APP_ID as string,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();

// Définir la persistance locale
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Persistance configurée sur locale');
  })
  .catch((error) => {
    console.error('Erreur de configuration de la persistance :', error);
  });

// export ce que l'on veut pouvoir réutiliser par la suite dans l'app
export { auth, provider };
export default boot(() => {});
