import vision from '@google-cloud/vision';
import { fileURLToPath } from 'url';
import path from 'path';
import { createWorker } from 'tesseract.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialise le client Vision
const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.DEV
    ? path.join(__dirname, '../keys/ocr-image-466705-da5e8a78c3e4.json')
    : '/etc/secrets/ocr-image-466705-da5e8a78c3e4.json',
});

export async function captureToTextWithVisionAPI(req, res) {
  try {
    const { imageBase64 } = req.body;

    const [result] = await client.textDetection({
      image: { content: imageBase64.split(',')[1] }, // enlever "data:image/png;base64,"
    });

    const detections = result.textAnnotations;
    res.json({ text: detections[0]?.description || '' });
  } catch (err) {
    console.error(err);
    res.status(500).send('OCR processing failed.');
  }
}

export async function captureToTextWithTesseract(req, res) {
  console.log('start processing OCR tesseract...');

  let worker = null;

  try {
    const { imageBase64, language } = req.body;

    let lang = 'eng';

    switch (language) {
      case 'fr-FR':
        lang = 'fra';
        break;
      default:
        lang = 'eng';
        break;
    }

    // fra
    worker = await createWorker(lang, 1, {
      logger: (message) => {},
    });

    const result = await worker.recognize(imageBase64);

    res.json({ text: result.data.text || '' });
  } catch (err) {
    console.error(err);
    res.status(500).send('OCR processing failed.');
  } finally {
    if (worker) {
      await worker.terminate();
      worker = null;
    }
  }
}
