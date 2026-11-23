import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config';
import routerApi from './router.js';
import { isAuthenticated } from './middleware/isAuthenticated.js';
import { homeServer } from './controller/global.js';

const app = express();
const port = process.env.PORT || 3000;

/* BACKEND */
/* Toutes les routes commenceront donc par /api */

// Configuration de base
app.use(
  cors({
    origin: [
      'http://localhost:9200',
      'http://localhost:9000',
      'http://localhost:9300',
      'https://biblio-references-tool.onrender.com',
    ],
    credentials: true,
  }),
);
app.use(fileUpload());
app.use(bodyParser.json({ limit: '10mb' }));

app.get('/home', homeServer);

app.use('/api', isAuthenticated, routerApi);

/* 
SERVE FRONTEND 
La route appelé ne concerne pas l'API, alors sert le front
*/

// Pour ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 📁 Chemins absolus vers le build PWA
const pwaPath = path.resolve(__dirname, '../dist/pwa');

// Sert les fichiers statiques (JS, CSS, etc.)
app.use(express.static(pwaPath));
// Redirige toutes les routes vers index.html (pour Vue Router mode history)

app.use((req, res, next) => {
  const indexPath = path.resolve(__dirname, '../dist/pwa/index.html');
  res.sendFile(indexPath);
});

/* MIDDLEWARE FOR CONNECTED USER */

// function isAuthenticated(req, res, next) {
//   if (req.session && req.session.user) {
//     return next();
//   }
//   res.status(401).json({ message: 'Non authentifié' });
// }

/* Suppression d'un appareil */
/* Par contre, si un utilisateur veut supprimer un appareil enregistré, là oui, tu dois :
 supprimer son credential de ta base ou lui proposer une UI pour "gérer ses appareils" comme Google le fait */

const server = app.listen(port, () => {
  console.log('--------------------------------');
  console.log(`Backend prêt : http://localhost:${port}`);
  console.log(`PID : ${process.pid}`);
  console.log(new Date().toISOString());
  console.log('--------------------------------');
});

server.on('error', (err) => {
  console.error('Erreur serveur :', err);
});

/* TODO
test si err connect, dans le terminal 
netstat -ano | findstr :3000
puis:
tasklist /FI "PID eq process.pid"
*/
