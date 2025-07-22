import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import bodyParser from 'body-parser';

import routerApi from './router.js';

const app = express();
const port = process.env.PORT || 3000;

/* BACKEND */
/* Toutes les routes commenceront donc par /api */

// Configuration de base
app.use(
  cors({
    origin: ['http://localhost:9200', 'https://biblio-references-tool.onrender.com'],
    credentials: true,
  }),
);
app.use(fileUpload());
app.use(bodyParser.json({ limit: '10mb' }));

app.use('/api', routerApi);

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

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
