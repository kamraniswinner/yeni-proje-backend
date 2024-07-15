import express from 'express';
import { config } from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import shippingRoutes from './routes/shippingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import ownerRoutes from './routes/ownerRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import favouriteRoutes from './routes/favouriteRoutes.js';
import cors from 'cors';
//import { notFound, errorHandler } from './middleware/errorMiddleware.js';

config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/favourite', favouriteRoutes);

// Error handling middleware
//app.use(notFound);
//app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Bucket Name...:', process.env.S3_BUCKET_NAME);
});
