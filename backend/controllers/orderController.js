import Order from '../models/Order.js';
import asyncHandler from 'express-async-handler';
import paypal from '@paypal/checkout-server-sdk';
import dotenv from 'dotenv';
dotenv.config();

const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

/*const createOrderByCart = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod, orderItems, totalPrice, taxPrice, shippingPrice, orderAmount } = req.body;

  try {
    // Validate inputt
    if (!shippingAddress || !paymentMethod || !orderItems || !totalPrice || !taxPrice || !shippingPrice || !orderAmount) {
      return res.status(400).json({ message: 'Invalid request. Please provide all required fields.' });
    }

    // Create PayPal order
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: orderAmount
        }
      }]
    });

    const order = await client.execute(request);
    console.log('PayPal order created:', order);

    // Capture payment
    const captureRequest = new paypal.orders.OrdersCaptureRequest(order.result.id);
    captureRequest.requestBody({});
    const capture = await client.execute(captureRequest);
    console.log('PayPal payment captured:', capture);

    if (capture.result.status !== 'COMPLETED') {
      console.log('Payment not confirmed');
      return res.status(400).json({ message: 'Payment not confirmed' });
    }

    // Create the order in the database
    const newOrder = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice,
      orderAmount,
      isPaid: true,
      paidAt: Date.now(),
      paymentResult: {
        id: capture.result.id,
        status: capture.result.status,
        update_time: capture.result.update_time,
        email_address: capture.result.payer.email_address
      }
    });

    // Save the order
    const createdOrder = await newOrder.save();

    // Respond with the created order
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Error creating order:', error); // Log the error for further investigation
    res.status(500).json({ message: 'Server Error' });
  }
});
*/

const createOrderByCart = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod, orderItems, totalPrice, taxPrice, shippingPrice, orderAmount } = req.body;

  try {
    // Validate input
    if (!shippingAddress || !paymentMethod || !orderItems || !totalPrice || !taxPrice || !shippingPrice || !orderAmount) {
      console.log('Invalid request. Required fields are missing:', req.body); // Debug statement
      return res.status(400).json({ message: 'Invalid request. Please provide all required fields.' });
    }

    // Create the PayPal order
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: orderAmount
        }
      }]
    });

    const orderResponse = await client.execute(request);
    const order = orderResponse.result;

    console.log('PayPal order created:', order); // Debug statement

    // Extract the approval URL from the order links
    const approvalUrl = order.links.find(link => link.rel === 'approve').href;

    // Redirect the user to the approvalUrl
    res.status(200).json({ approvalUrl });

  } catch (error) {
    console.error('Error creating PayPal order:', error); // Log the error for further investigation
    res.status(500).json({ message: 'Server Error' });
  }
});


// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

export { createOrderByCart, updateOrderToPaid, updateOrderToDelivered, getMyOrders, getOrders };
