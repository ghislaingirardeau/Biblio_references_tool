import express from 'express';
import { homeServer } from './controller/global.js';
import { imgToText, captureToTextWithVisionAPI } from './controller/ocr.js';
import { rateLimitByUser } from './middleware/rateLimitFirestore.js';
const router = express.Router();

router.get('/', homeServer);

router.post('/ocrCapture', rateLimitByUser, captureToTextWithVisionAPI);

export default router;
