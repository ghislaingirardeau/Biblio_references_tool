export function useDesktop() {
  const isElectron = !!window.electronAPI;

  const readClipboard = async () => {
    console.log(isElectron);
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
