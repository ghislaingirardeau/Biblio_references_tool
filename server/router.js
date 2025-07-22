import express from 'express';
import { homeServer } from './controller/global.js';
const router = express.Router();

router.get('/', homeServer);

export default router;
