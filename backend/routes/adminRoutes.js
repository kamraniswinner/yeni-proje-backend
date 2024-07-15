import express from 'express';
const router = express.Router();
import {
  createAdminUser,
  adminLogin,
  requestAdminPasswordReset,
  confirmAdminPasswordReset,
} from '../controllers/adminController.js';


// Create new admin user (only root users can create)
router.post('/createAdmin', createAdminUser);

// Admin login
router.post('/login', adminLogin);

// Request password reset
router.post('/requestPasswordReset', requestAdminPasswordReset);

// Confirm password reset
router.post('/confirmPasswordReset', confirmAdminPasswordReset);

export default router;
