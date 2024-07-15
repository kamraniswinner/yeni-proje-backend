// src/routes/inventoryRoutes.js
import express from 'express';
import { createInventory, updateInventory, deleteInventory, getAllInventory, getInventoryById, getInventoryByProductNumber } from '../controllers/inventoryController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Route to create a new inventory item with image upload
router.post('/create', upload.array('images'), createInventory);

// Route to update an inventory item with image upload
router.put('/:id', upload.array('images'), updateInventory);

// Route to delete an inventory item
router.delete('/:id', deleteInventory);

// Route to get all inventory items
router.get('/', getAllInventory);

// Route to get a single inventory item by id
router.get('/:id', getInventoryById);

router.get('/bynumber/:productNumber', getInventoryByProductNumber);


export default router;
