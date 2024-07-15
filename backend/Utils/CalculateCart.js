import Cart from '../models/Cart.js';  // Import the Cart model

const calculateCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate('items.product');

  if (!cart) {
    throw new Error('Cart not found');
  }

  const orderItems = cart.items.map(item => ({
    product: item.product._id,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    image: item.image,
  }));

  const totalPrice = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const taxPrice = totalPrice * 0.1;  // Assuming a tax rate of 10%
  const shippingPrice = totalPrice > 100 ? 0 : 10;  // Free shipping for orders over $100

  return {
    orderItems,
    totalPrice,
    taxPrice,
    shippingPrice,
  };
};


export default calculateCart;