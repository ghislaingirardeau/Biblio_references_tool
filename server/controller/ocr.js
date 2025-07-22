import path from 'path';
import vision from '@google-cloud/vision';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialise le client Vision
const client = new vision.ImageAnnotatorClient({
  keyFilename: path.join(__dirname, '../keys/ocr-image-466705-da5e8a78c3e4.json'), // adapte si nécessaire
});

export async function imgToText(req, res) {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).send('No image uploaded.');
    }

    const file = req.files.image;
    const [result] = await client.textDetection(file.data);

    const detections = result.textAnnotations;
    const fullText = detections.length > 0 ? detections[0].description : '';

    res.json({ text: fullText });
  } catch (err) {
    console.error(err);
    res.status(500).send('OCR processing failed.');
  }
}
