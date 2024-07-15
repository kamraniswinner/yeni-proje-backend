import Payment from '../models/Payment.js';

// @desc    Create new payment
// @route   POST /api/payment
// @access  Private
const addPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod, paymentResult } = req.body;
    const payment = await Payment.create({
      orderId,
      paymentMethod,
      paymentResult,
    });
    res.status(201).json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export { addPayment };
