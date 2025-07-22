import express from 'express';
import { homeServer } from './controller/global.js';
import { imgToText } from './controller/ocr.js';
const router = express.Router();

router.get('/', homeServer);

router.post('/ocr', imgToText);

export default router;
