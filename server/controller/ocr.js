import vision from '@google-cloud/vision';
import { fileURLToPath } from 'url';
import path from 'path';
import { createWorker } from 'tesseract.js';
import cloudinary from '../cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialise le client Vision
const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.DEV
    ? path.join(__dirname, '../keys/ocr-image-466705-da5e8a78c3e4.json')
    : '/etc/secrets/ocr-image-466705-da5e8a78c3e4.json',
});

// Save photo to cloudinary

async function saveToCloudinary(imageBase64, uid) {
  try {
    const result = await cloudinary.uploader.upload(imageBase64, {
      folder: `biblio_tool/${uid}/captures`,
      resource_type: 'image',
    });

    const imageUrl = result.secure_url;
    const publicId = result.public_id;

    return { imageUrl, publicId };
  } catch (error) {
    console.log(error);
  }
}

export async function captureToTextWithVisionAPI(req, res) {
  try {
    const { imageBase64, user } = req.body;

    const [result] = await client.textDetection({
      image: { content: imageBase64.split(',')[1] }, // enlever "data:image/png;base64,"
    });

    const detections = result.textAnnotations;

    const { imageUrl, publicId } = await saveToCloudinary(imageBase64, user.uid);

    res.json({ text: detections[0]?.description || '', imageUrl, publicId });
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
