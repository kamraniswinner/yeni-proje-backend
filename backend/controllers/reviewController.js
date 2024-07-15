import asyncHandler from 'express-async-handler';
import Review from '../models/Review.js';

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
export const createReview = asyncHandler(async (req, res) => {
  const { rating, comment, productId } = req.body;

  const review = new Review({
    user: req.user._id,
    product: productId,
    rating,
    comment,
  });

  const createdReview = await review.save();
  res.status(201).json(createdReview);
});

// @desc    Get all reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
export const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name');
  res.json(reviews);
});
