import vision from '@google-cloud/vision';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(process.env.DEV);

// Initialise le client Vision
const client = new vision.ImageAnnotatorClient({
  keyFilename: '/etc/secrets/ocr-image-466705-da5e8a78c3e4.json',
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

    fullText.replaceAll('\n', ' ');
    const textFormated = fullText.replaceAll('\n', ' ');

    res.json({ text: textFormated });
  } catch (err) {
    console.error(err);
    res.status(500).send('OCR processing failed.');
  }
}

export async function captureToText(req, res) {
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
