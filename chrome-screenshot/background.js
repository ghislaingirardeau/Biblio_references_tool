chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) {
    return;
  }

  try {
    await chrome.tabs.sendMessage(tab.id, {
      type: 'START_CAPTURE',
    });
  } catch (error) {
    console.error('Impossible de démarrer la capture :', error);
  }
});

chrome.runtime.onMessage.addListener(async (message, sender) => {
  /*
   * ==========================================
   * CAPTURE DE L'ÉCRAN
   * ==========================================
   */

  if (message.type === 'CAPTURE_SCREEN') {
    if (!sender.tab?.id) {
      return;
    }

    try {
      const image = await chrome.tabs.captureVisibleTab(sender.tab.windowId, {
        format: 'png',
      });

      /*
       * Retourne l'image au site capturé
       * afin que content.js puisse la recadrer.
       */

      await chrome.tabs.sendMessage(sender.tab.id, {
        type: 'SCREEN_CAPTURED',
        image,
      });
    } catch (error) {
      console.error('Erreur capture écran :', error);
    }

    return;
  }

  /*
   * ==========================================
   * ENVOI VERS QUASAR
   * ==========================================
   */

  if (message.type === 'SEND_TO_QUASAR') {
    const image = message.image;

    if (!image) {
      return;
    }

    /*
     * Cherche un onglet de ton application.
     *
     * IMPORTANT :
     * remplace cette URL par celle de ton application.
     */

    const tabs = await chrome.tabs.query({
      url: ['http://localhost:9000/*', 'https://biblio-references-tool.onrender.com/*'],
    });

    if (!tabs.length) {
      console.warn('Aucun onglet Quasar trouvé');

      return;
    }

    const quasarTab = tabs[0];

    /*
     * Envoie l'image au content script
     * présent dans l'application Quasar.
     */

    try {
      await chrome.tabs.sendMessage(quasarTab.id, {
        type: 'SCREENSHOT_FOR_QUASAR',
        image,
      });

      console.log('Capture envoyée à Quasar');
    } catch (error) {
      console.error('Impossible de contacter Quasar :', error);
    }
  }
});
