// ==========================================
// CLIC SUR L'ICÔNE DE L'EXTENSION
// → Capture d'image
// ==========================================

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

// ==========================================
// MESSAGES DU CONTENT SCRIPT
// ==========================================

chrome.runtime.onMessage.addListener(async (message, sender) => {
  // ==========================================
  // CAPTURE DE L'ÉCRAN
  // ==========================================

  if (message.type === 'CAPTURE_SCREEN') {
    if (!sender.tab?.id) {
      return;
    }

    try {
      const image = await chrome.tabs.captureVisibleTab(sender.tab.windowId, {
        format: 'png',
      });

      await chrome.tabs.sendMessage(sender.tab.id, {
        type: 'SCREEN_CAPTURED',
        image,
      });
    } catch (error) {
      console.error('Erreur capture écran :', error);
    }

    return;
  }

  // ==========================================
  // ENVOI DE L'IMAGE VERS QUASAR
  // ==========================================

  if (message.type === 'SEND_TO_QUASAR') {
    const image = message.image;

    if (!image) {
      return;
    }

    const tabs = await chrome.tabs.query({
      url: ['http://localhost:9000/*', 'https://biblio-references-tool.onrender.com/*'],
    });

    if (!tabs.length) {
      console.warn('Aucun onglet Quasar trouvé');
      return;
    }

    const quasarTab = tabs[0];

    try {
      await chrome.tabs.sendMessage(quasarTab.id, {
        type: 'SCREENSHOT_FOR_QUASAR',
        image,
      });

      console.log('Capture envoyée à Quasar');
    } catch (error) {
      console.error('Impossible de contacter Quasar :', error);
    }

    return;
  }

  // ==========================================
  // TEXTE SÉLECTIONNÉ
  // ==========================================

  if (message.type === 'SEND_SELECTED_TEXT') {
    const text = message.text;

    if (!text) {
      console.warn('Aucun texte reçu');
      return;
    }

    console.log('Texte sélectionné :', text);

    // Cherche ton application Biblio Tool
    const tabs = await chrome.tabs.query({
      url: ['http://localhost:9000/*', 'https://biblio-references-tool.onrender.com/*'],
    });

    if (!tabs.length) {
      console.error('Aucun onglet Biblio Tool trouvé');
      return;
    }

    const quasarTab = tabs[0];

    try {
      await chrome.tabs.sendMessage(quasarTab.id, {
        type: 'SELECTED_TEXT_FOR_QUASAR',
        text,
      });
    } catch (error) {
      console.error('Impossible de contacter Biblio Tool :', error);
    }

    return;
  }
});

// ==========================================
// RACCOURCIS CLAVIER
// ==========================================

chrome.commands.onCommand.addListener(async (command) => {
  console.log('Commande reçue :', command);

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  // ==========================================
  // CAPTURE IMAGE
  // ==========================================

  if (command === 'start-capture') {
    if (!tab?.id) {
      return;
    }

    try {
      await chrome.tabs.sendMessage(tab.id, {
        type: 'START_CAPTURE',
      });
    } catch (error) {
      console.error('Impossible de démarrer la capture :', error);
    }

    return;
  }

  // ==========================================
  // TEXTE SÉLECTIONNÉ
  // ==========================================

  if (command === 'send-selected-text') {
    if (!tab?.id) {
      return;
    }

    try {
      await chrome.tabs.sendMessage(tab.id, {
        type: 'GET_SELECTED_TEXT',
      });
    } catch (error) {
      console.error('❌ Impossible de récupérer la sélection');
      console.error('Erreur complète :', error);
      console.error('Onglet concerné :', tab);
    }

    return;
  }
});
