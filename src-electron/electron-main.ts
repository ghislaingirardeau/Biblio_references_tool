import { app, BrowserWindow, clipboard, ipcMain, nativeImage } from 'electron';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { createServer } from 'http';

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

const currentDir = fileURLToPath(new URL('.', import.meta.url));

let mainWindow: BrowserWindow | undefined;

// ==========================================
// CREATE MINI LOCAL SERVER TO LISTEN TO CHROME EXTENSION TO ADD WEB REFERENCE TO ELECTRON

const EXTENSION_ORIGIN = 'chrome-extension://kkocnbophcaapdoomfdgdehkcjcdjgjj';

const EXTENSION_BRIDGE_PORT = 32145;

const extensionBridge = createServer((req, res) => {
  void (async () => {
    const origin = req.headers.origin;

    console.log('serveur electron', origin);

    // Vérifier l'origine de l'extension
    if (origin !== EXTENSION_ORIGIN) {
      res.writeHead(403);
      res.end('Origin not allowed');
      return;
    }

    // Autoriser CORS pour l'extension
    res.setHeader('Access-Control-Allow-Origin', EXTENSION_ORIGIN);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    if (req.method !== 'POST' || req.url !== '/import-reference') {
      res.writeHead(404);
      res.end();
      return;
    }

    try {
      const chunks: Buffer[] = [];
      let totalSize = 0;

      for await (const chunk of req) {
        totalSize += chunk.length;

        if (totalSize > 1024 * 1024) {
          res.writeHead(413);
          res.end('Payload too large');
          return;
        }

        chunks.push(chunk);
      }

      const payload = JSON.parse(Buffer.concat(chunks).toString('utf-8'));

      if (
        !payload ||
        typeof payload !== 'object' ||
        typeof payload.title !== 'string' ||
        typeof payload.URL !== 'string'
      ) {
        res.writeHead(400);
        res.end('Invalid payload');
        return;
      }

      const pageUrl = new URL(payload.URL);

      if (!['http:', 'https:'].includes(pageUrl.protocol)) {
        res.writeHead(400);
        res.end('Invalid URL');
        return;
      }

      if (!mainWindow || mainWindow.isDestroyed()) {
        res.writeHead(503);
        res.end('Biblio Tool is unavailable');
        return;
      }

      // Transmettre les données à Vue
      mainWindow.webContents.send('extension:import-web-reference', payload);

      res.writeHead(202, {
        'Content-Type': 'application/json',
      });

      res.end(
        JSON.stringify({
          success: true,
          message: 'Reference received by Electron',
        }),
      );
    } catch (error) {
      console.error('Erreur Extension Bridge:', error);

      res.writeHead(400);
      res.end('Invalid request');
    }
  })();
});

// ==========================================

async function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(currentDir, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(
        currentDir,
        path.join(
          process.env.QUASAR_ELECTRON_PRELOAD_FOLDER!,
          'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION,
        ),
      ),
    },
  });

  if (process.env.DEV) {
    await mainWindow.loadURL(process.env.APP_URL!);
  } else {
    await mainWindow.loadFile('index.html');
  }

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow?.webContents.closeDevTools();
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });
}

void app.whenReady().then(async () => {
  await createWindow();

  extensionBridge.listen(EXTENSION_BRIDGE_PORT, '127.0.0.1', () => {
    console.log(`Extension Bridge actif sur le port ${EXTENSION_BRIDGE_PORT}`);
  });

  extensionBridge.on('error', (error) => {
    console.error('Erreur Extension Bridge:', error);
  });
});

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === undefined) {
    void createWindow();
  }
});

app.on('before-quit', () => {
  extensionBridge.close();
});

ipcMain.handle('read-clipboard', () => {
  return clipboard.readText();
});

// Récupérer l'image sélectionnée
ipcMain.handle('get-snipping-result', async () => {
  const items = await clipboard.read();

  for (const item of items) {
    const imageType = item.types.find((type) => type.startsWith('image/'));

    if (imageType) {
      const blob = (await item.getType(imageType)) as Blob;
      const buffer = Buffer.from(await blob.arrayBuffer());

      const image = nativeImage.createFromBuffer(buffer);

      if (!image.isEmpty()) {
        return image.toDataURL();
      }
    }
  }
});
