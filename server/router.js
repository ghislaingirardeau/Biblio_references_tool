import express from 'express';
import { captureToTextWithVisionAPI, captureToTextWithTesseract } from './controller/ocr.js';
import { rateLimitByUser } from './middleware/rateLimitFirestore.js';
const router = express.Router();

router.post('/ocrCapture', rateLimitByUser, captureToTextWithVisionAPI);
router.post('/ocrCaptureTesseract', rateLimitByUser, captureToTextWithTesseract);

export default router;
