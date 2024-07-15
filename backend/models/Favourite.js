import { Schema, model } from 'mongoose';

const favouriteSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    }
  ],
}, {
  timestamps: true,
});

const Favourite = model('Favourite', favouriteSchema);

export default Favourite;
