import { Schema, model } from 'mongoose';

const deliverySchema = new Schema({
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  deliveryStatus: {
    type: String,
    required: true,
    default: 'Not Delivered',
    enum: ['Not Delivered', 'Out for Delivery', 'Delivered'],
  },
  deliveredAt: {
    type: Date,
  },
  deliveryAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
}, {
  timestamps: true,
});

export default model('Delivery', deliverySchema);
