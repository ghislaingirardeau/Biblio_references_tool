export const isElectron = !!window.electronAPI;

export function useDesktop() {
  const isElectron = !!window.electronAPI;

  const readClipboard = async () => {
    if (isElectron) {
      return window.electronAPI.readClipboard();
    }

    return navigator.clipboard.readText();
  };

  const captureScreen = async () => {
    if (!isElectron) {
      throw new Error('Capture disponible uniquement dans Electron');
    }

    return window.electronAPI.captureScreen();
  };

  return {
    isElectron,
    readClipboard,
    captureScreen,
  };
}
