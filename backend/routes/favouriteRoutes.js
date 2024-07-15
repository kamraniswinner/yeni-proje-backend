import express from 'express';
import { getFavourites, addFavourite, removeFavourite } from '../controllers/favouriteController.js';
import { protect } from '../middleware/authMiddleware.js'; // Assuming you have authentication middleware

const router = express.Router();

router.route('/:userId')
  .get( getFavourites)
  .post( addFavourite)
  .delete( removeFavourite);

export default router;
