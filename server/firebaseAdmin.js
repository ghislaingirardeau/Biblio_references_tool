// firebaseAdmin.js
import admin from 'firebase-admin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccount = process.env.DEV
  ? path.join(__dirname, './keys/my-bibliography-firebase-adminsdk-fbsvc-00b4bee4a3.json')
  : '/etc/secrets/my-bibliography-firebase-adminsdk-fbsvc-00b4bee4a3.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
