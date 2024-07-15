import express from 'express';
const router = express.Router();
import { createOrderByCart, updateOrderToPaid, updateOrderToDelivered, getMyOrders, getOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(protect,createOrderByCart).get(getOrders);
router.route('/myorders').get(protect,getMyOrders);
router.route('/:id/pay').put(updateOrderToPaid);
router.route('/:id/deliver').put(updateOrderToDelivered);

export default router;
