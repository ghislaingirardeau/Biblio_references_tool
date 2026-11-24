import type { WebReferencePayload } from 'src/types/API';

declare namespace NodeJS {
  interface ProcessEnv {
    QUASAR_PUBLIC_FOLDER: string;
    QUASAR_ELECTRON_PRELOAD_FOLDER: string;
    QUASAR_ELECTRON_PRELOAD_EXTENSION: string;
    APP_URL: string;
  }
}

export interface ElectronAPI {
  readClipboard: () => Promise<string>;
  getSnippingResult: () => Promise<string | null>;
  onImportWebReference: (payload: WebReferencePayload) => null;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
