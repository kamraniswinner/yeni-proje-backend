import express from 'express';
import { 
  createOwner, 
  ownerLogin, 
  requestOwnerPasswordReset, 
  confirmOwnerPasswordReset, 
  changeAdminRole, 
  getAllAdmins, 
  deleteAdmin 
} from '../controllers/ownerController.js';

const router = express.Router();

// Route to create a new owner
// This route is protected and can only be accessed by an existing 888
router.post('/createOwner', createOwner);

// Route for owner login
router.post('/login', ownerLogin);

// Route to request a password reset for owner
router.post('/requestPasswordReset', requestOwnerPasswordReset);

// Route to confirm password reset for owner
router.post('/confirmPasswordReset', confirmOwnerPasswordReset);

// Route to change admin role
// This route is protected and can only be accessed by an existing owner
router.put('/changeAdminRole/:id', changeAdminRole);

// Route to get all admins
// This route is protected and can only be accessed by an existing owner
router.get('/admins', getAllAdmins);

// Route to delete an admin
// This route is protected and can only be accessed by an existing owner
router.delete('/deleteAdmin/:id', deleteAdmin);

export default router;
