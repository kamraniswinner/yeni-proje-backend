import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const ownerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['owner'],
    default: 'owner',
  },
}, {
  timestamps: true,
});

ownerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  // Ensure a maximum of three owners
  const ownerCount = await mongoose.models.Owner.countDocuments();
  if (ownerCount >= 3) {
    const error = new Error('Cannot have more than three owners');
    return next(error);
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

ownerSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Owner = mongoose.model('Owner', ownerSchema);

export default Owner;
