import express from 'express';
const router = express.Router();
import {
  getAllProducts,
  getProductByProductNumber,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

router.get('/', getAllProducts);
router.get('/:productNumber', getProductByProductNumber);
router.post('/', createProduct);
router.put('/:productNumber', updateProduct);
router.delete('/:productNumber', deleteProduct);
export default router;
