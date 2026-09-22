let captureOverlay = null;
let selectionBox = null;

let startX = 0;
let startY = 0;

let isSelecting = false;

// ========================================
// 1. Capture texte
// ========================================

chrome.runtime.onMessage.addListener((message) => {
  console.log('Message reçu par content.js :', message);

  if (message.type === 'GET_SELECTED_TEXT') {
    const selection = window.getSelection();

    const selectedText = selection?.toString().trim();

    if (!selectedText) {
      console.warn('❌ Aucun texte sélectionné');
      return;
    }

    chrome.runtime.sendMessage({
      type: 'SEND_SELECTED_TEXT',
      text: selectedText,
    });

    return;
  }

  if (message.type === 'SELECTED_TEXT_FOR_QUASAR') {
    console.log('Texte reçu pour Biblio Tool :', message.text);

    window.dispatchEvent(
      new CustomEvent('EXTENSION_SELECTED_TEXT', {
        detail: {
          text: message.text,
        },
      }),
    );
  }
});

// ========================================
// 2. Capture d'images
// ========================================

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'START_CAPTURE') {
    startCapture();
    return;
  }

  if (message.type === 'SCREEN_CAPTURED') {
    handleScreenshot(message.image);
    return;
  }

  if (message.type === 'SCREENSHOT_FOR_QUASAR') {
    console.log('Extension → Quasar : image reçue');

    window.dispatchEvent(
      new CustomEvent('EXTENSION_SCREENSHOT', {
        detail: {
          image: message.image,
        },
      }),
    );

    return;
  }
});

function startCapture() {
  if (captureOverlay) {
    return;
  }

  captureOverlay = document.createElement('div');

  captureOverlay.id = 'chrome-capture-overlay';

  document.body.appendChild(captureOverlay);

  selectionBox = document.createElement('div');

  selectionBox.id = 'chrome-capture-selection';

  captureOverlay.appendChild(selectionBox);

  captureOverlay.addEventListener('mousedown', handleMouseDown);

  captureOverlay.addEventListener('mousemove', handleMouseMove);

  captureOverlay.addEventListener('mouseup', handleMouseUp);

  document.addEventListener('keydown', handleEscape);

  document.body.style.userSelect = 'none';
}

function handleMouseDown(event) {
  if (event.button !== 0) {
    return;
  }

  isSelecting = true;

  startX = event.clientX;
  startY = event.clientY;

  updateSelection(startX, startY, 0, 0);
}

function handleMouseMove(event) {
  if (!isSelecting) {
    return;
  }

  const currentX = event.clientX;
  const currentY = event.clientY;

  const x = Math.min(startX, currentX);
  const y = Math.min(startY, currentY);

  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);

  updateSelection(x, y, width, height);
}

function handleMouseUp(event) {
  if (!isSelecting) {
    return;
  }

  isSelecting = false;

  const currentX = event.clientX;
  const currentY = event.clientY;

  const x = Math.min(startX, currentX);
  const y = Math.min(startY, currentY);

  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);

  if (width < 10 || height < 10) {
    stopCapture();

    return;
  }

  // Sauvegarde les coordonnées
  // avant de demander la capture.
  window.__captureRect = {
    x,
    y,
    width,
    height,
  };

  // Cache le sélecteur avant la capture.
  captureOverlay.style.display = 'none';

  chrome.runtime.sendMessage({
    type: 'CAPTURE_SCREEN',
  });
}

function updateSelection(x, y, width, height) {
  selectionBox.style.left = `${x}px`;
  selectionBox.style.top = `${y}px`;

  selectionBox.style.width = `${width}px`;
  selectionBox.style.height = `${height}px`;
}

async function handleScreenshot(dataUrl) {
  try {
    const rect = window.__captureRect;

    if (!rect) {
      stopCapture();
      return;
    }

    const image = await loadImage(dataUrl);

    /*
     * devicePixelRatio est important.
     *
     * Par exemple :
     *
     * écran classique : 1
     * écran Retina : 2
     *
     * captureVisibleTab() peut produire
     * une image deux fois plus grande.
     */

    const scale = window.devicePixelRatio || 1;

    const canvas = document.createElement('canvas');

    canvas.width = Math.round(rect.width * scale);

    canvas.height = Math.round(rect.height * scale);

    const context = canvas.getContext('2d');

    context.drawImage(
      image,

      Math.round(rect.x * scale),
      Math.round(rect.y * scale),

      Math.round(rect.width * scale),
      Math.round(rect.height * scale),

      0,
      0,

      Math.round(rect.width * scale),
      Math.round(rect.height * scale),
    );

    const croppedImage = canvas.toDataURL('image/png');

    stopCapture();

    showResult(croppedImage);

    /*
     * Envoie l'image à l'application.
     */
    sendToQuasar(croppedImage);

    /*
     * Copie également l'image
     * dans le presse-papiers.
     */
    await copyImageToClipboard(canvas);
  } catch (error) {
    console.error('Erreur traitement capture :', error);

    stopCapture();
  }
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      resolve(image);
    };

    image.onerror = () => {
      reject(new Error('Impossible de charger la capture'));
    };

    image.src = dataUrl;
  });
}

async function copyImageToClipboard(canvas) {
  try {
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));

    if (!blob) {
      return;
    }

    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob,
      }),
    ]);

    console.log('Capture copiée dans le presse-papiers');
  } catch (error) {
    console.warn('Impossible de copier la capture :', error);
  }
}

function sendToQuasar(image) {
  chrome.runtime.sendMessage({
    type: 'SEND_TO_QUASAR',
    image,
  });
}

function showResult(image) {
  const existing = document.getElementById('chrome-capture-result');

  if (existing) {
    existing.remove();
  }

  const container = document.createElement('div');

  container.id = 'chrome-capture-result';

  const imageElement = document.createElement('img');

  imageElement.src = image;

  imageElement.className = 'chrome-capture-preview';

  const closeButton = document.createElement('button');

  closeButton.textContent = '×';

  closeButton.className = 'chrome-capture-close';

  closeButton.addEventListener('click', () => {
    container.remove();
  });

  const info = document.createElement('div');

  info.className = 'chrome-capture-info';

  info.textContent = 'Capture effectuée — image copiée';

  container.appendChild(imageElement);

  container.appendChild(info);

  container.appendChild(closeButton);

  document.body.appendChild(container);
}

function handleEscape(event) {
  if (event.key === 'Escape') {
    stopCapture();
  }
}

function stopCapture() {
  if (captureOverlay) {
    captureOverlay.remove();
  }

  captureOverlay = null;
  selectionBox = null;

  isSelecting = false;

  document.body.style.userSelect = '';

  document.removeEventListener('keydown', handleEscape);
}
