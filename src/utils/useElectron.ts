export const isElectron = !!window.electronAPI;

export function useDesktop() {
  const isElectron = !!window.electronAPI;

  const readClipboard = async () => {
    if (isElectron) {
      return window.electronAPI.readClipboard();
    }

    return navigator.clipboard.readText();
  };

  return {
    isElectron,
    readClipboard,
  };
}
