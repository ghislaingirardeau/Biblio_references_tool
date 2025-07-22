import express from 'express';
import { homeServer } from './controller/global.js';
import { imgToText, captureToText } from './controller/ocr.js';
const router = express.Router();

router.get('/', homeServer);

router.post('/ocrFile', imgToText);
router.post('/ocrCapture', captureToText);

export default router;
