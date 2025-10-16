import express from 'express';
import { homeServer } from './controller/global.js';
import { imgToText, captureToText } from './controller/ocr.js';
import { rateLimitByUser } from './middleware/rateLimitFirestore.js';
const router = express.Router();

router.get('/', homeServer);

router.post('/ocrFile', rateLimitByUser, imgToText);
router.post('/ocrCapture', rateLimitByUser, captureToText);

export default router;
