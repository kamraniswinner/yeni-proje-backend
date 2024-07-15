import express from 'express';
const router = express.Router();
import { addToCart, getCart, removeFromCart, calculateCart, clearCart } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/:userId').post ( addToCart);
router.route('/:userId').get( getCart);
router.route('/:userId').delete( clearCart);
router.route('/:productId').delete( removeFromCart);
router.route('/calculate/:userId').get( calculateCart);

export default router;
