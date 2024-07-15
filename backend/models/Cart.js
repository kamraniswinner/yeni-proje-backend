import { Schema, model } from 'mongoose';

const cartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cartItems: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Products',
        required: true,
      },
      name: { 
        type: String, 
        required: true 
      },
      quantity: { 
        type: Number, 
        required: true 
      },
      price: 
      { type: Number, 
        required: true 
      },
      image: { 
        type: String, 
        required: true 
      },
    },
  ],
}, {
  timestamps: true,
});

export default model('Cart', cartSchema);
