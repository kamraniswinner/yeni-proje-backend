import mongoose from 'mongoose';

const { Schema } = mongoose;

const inventorySchema = new Schema({
  productNumber: {
    type: String,
    required: true,
    unique: true,
  },
  productName: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  batchNo: {
    type: String,
    required: true,
  },
  batchIncomingDate: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;
