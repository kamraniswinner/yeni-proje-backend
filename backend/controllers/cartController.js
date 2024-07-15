import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart.js';
import Products from '../models/Products.js';
import User from '../models/User.js';


const addToCart = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { prodId, quantity } = req.body;

  try {
    // Validate input
    if (!userId || !prodId || !quantity) {
      console.log('Invalid request. Please provide userId, id, and quantity:', req.body); // Debug statement
      return res.status(400).json({ message: 'Invalid request. Please provide userId, id, and quantity.' });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found for userId:', userId); // Debug statement
      return res.status(404).json({ message: 'User not found' });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      console.log('Cart not found for userId:', userId); // Debug statement
      cart = new Cart({ user: userId, cartItems: [] });
    }

    // Debug statements to check user and cart
    console.log('User:', user);
    console.log('Cart:', cart);

    // Check if product already exists in cart
    const productIndex = cart.cartItems.findIndex(item => item.product.toString() === prodId);
    if (productIndex !== -1) {
      // Update quantity if product exists
      cart.cartItems[productIndex].quantity += quantity;
      console.log(`Updated quantity for product ${prodId} in cart:`, cart.cartItems[productIndex]); // Debug statement
    } else {
      // Add new product to cart
      const product = await Products.findById(prodId);
      if (!product) {
        console.log('Product not found for id:', prodId); // Debug statement
        return res.status(404).json({ message: 'Product not found' });
      }
      cart.cartItems.push({
        product: prodId,
        name: product.name,
        quantity: quantity,
        price: product.price,
        image: product.images[0] // Assuming 'image' is a field in your Product schema
      });
      console.log('Added new product to cart:', product); // Debug statement
    }

    // Save cart
    await cart.save();
    console.log('Cart saved successfully:', cart); // Debug statement

    // Respond with success message
    res.status(201).json({ message: 'Item added to cart' });
  } catch (error) {
    console.error('Error adding item to cart:', error); // Log the error for further investigation
    res.status(500).json({ message: 'Server Error' }); // Return a generic server error message
  }
});



// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  try {
    console.log(`Fetching cart for userId: ${userId}`); // Debug statement

    const cart = await Cart.findOne({ user: userId }).populate('cartItems.product', 'name price image');
    
    if (cart) {
      console.log('Cart found:', cart); // Debug statement
      res.json(cart);
    } else {
      console.log('Cart not found for userId:', userId); // Debug statement
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    console.error('Error fetching cart:', error); // Log the error for further investigation
    res.status(500).json({ message: 'Server Error' });
  }
});


// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    const itemIndex = cart.cartItems.findIndex((item) => item.product.toString() === productId);
    
    if (itemIndex > -1) {
      cart.cartItems.splice(itemIndex, 1);
      await cart.save();
      res.status(200).json({ message: 'Item removed from cart' });
    } else {
      res.status(404);
      throw new Error('Item not found in cart');
    }
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
});

// @desc    Calculate cart details
// @route   GET /api/cart/calculate
// @access  Private
const calculateCart = asyncHandler(async (req, res) => {
  const { userId } = req.params
  const cart = await Cart.findOne({ user: userId }).populate('cartItems.product');

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const orderItems = cart.cartItems.map(item => ({
    product: item.product._id,
    name: item.product.name,
    quantity: item.quantity,
    price: item.price,
    image: item.product.image,
  }));

  const totalPrice = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const taxPrice = totalPrice * 0.1;  // Assuming a tax rate of 10%
  const shippingPrice = totalPrice > 100 ? 0 : 10;  // Free shipping for orders over $100
  const cartAmount = totalPrice + shippingPrice + taxPrice;

  res.json({
    orderItems,
    totalPrice,
    taxPrice,
    shippingPrice,
    cartAmount,
  });
});

// @desc    Clear user's cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.params._id });

  if (cart) {
    cart.cartItems = [];
    await cart.save();
    res.status(200).json({ message: 'Cart cleared' });
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
});

export { addToCart, getCart, removeFromCart, calculateCart, clearCart };
