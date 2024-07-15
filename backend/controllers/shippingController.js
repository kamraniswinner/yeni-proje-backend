import Shipping from '../models/Shipping.js';

// @desc    Create new shipping
// @route   POST /api/shipping
// @access  Private
const addShipping = async (req, res) => {
  try {
    const { orderId, address, city, postalCode, country } = req.body;
    const shipping = await Shipping.create({
      orderId,
      address,
      city,
      postalCode,
      country,
    });
    res.status(201).json(shipping);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export { addShipping };
