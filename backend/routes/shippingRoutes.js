import express from 'express';
import { addShipping } from '../controllers/shippingController.js';

const router = express.Router();

router.post('/', addShipping);

export default router;
