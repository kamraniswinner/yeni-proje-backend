import { Router } from 'express';
import { registerUser, authUser, requestPasswordReset, confirmPasswordReset, getUserById, getAllUsers } from '../controllers/authController.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/resetPassword/request', requestPasswordReset);
router.post('/resetPassword/confirm', confirmPasswordReset);
router.get('/:id', getUserById);
router.get('/', getAllUsers);


export default router;
