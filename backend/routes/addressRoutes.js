import express from 'express';
import {
    createAddress,
    getAddressesByUserId,
    updateAddress,
    deleteAddress
} from '../controllers/addressController.js';

const router = express.Router();

router.post('/', createAddress);
router.get('/:userId', getAddressesByUserId);
router.put('/:userId/:addressId', updateAddress);
router.delete('/:userId/:addressId', deleteAddress);

export default router;
