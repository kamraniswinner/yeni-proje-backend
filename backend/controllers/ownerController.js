import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import nodemailer from 'nodemailer';
import Owner from '../models/Owner.js';
import Admin from '../models/Admin.js';

const { sign, verify } = jwt;

config();

const generateToken = (id) => {
  return sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Create a new owner
// @route   POST /api/owner/createOwner
// @access  Private (only accessible by existing owners)
const createOwner = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Check if the owner already exists
  const ownerExists = await Owner.findOne({ email });

  if (ownerExists) {
    res.status(400);
    throw new Error('Owner already exists');
  }

  // Ensure maximum of three owners
  const ownerCount = await Owner.countDocuments();
  if (ownerCount >= 3) {
    res.status(400);
    throw new Error('Cannot have more than three owners');
  }

  // Create a new owner
  const owner = await Owner.create({
    username,
    email,
    password,
  });

  if (owner) {
    res.status(201).json({
      _id: owner._id,
      username: owner.username,
      email: owner.email,
      role: owner.role,
      token: generateToken(owner._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid owner data');
  }
});

// @desc    Owner login
// @route   POST /api/owner/login
// @access  Public
const ownerLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const owner = await Owner.findOne({ email });

  if (owner && (await owner.matchPassword(password))) {
    res.json({
      _id: owner._id,
      username: owner.username,
      email: owner.email,
      userType: owner.userType,
      token: generateToken(owner._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

// @desc    Request password reset for owner
// @route   POST /api/owner/requestPasswordReset
// @access  Public
const requestOwnerPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const owner = await Owner.findOne({ email });
    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: 'Owner Password Reset',
      text: `Please click the following link to reset your password: ${process.env.CLIENT_URL}/resetOwnerPassword/${token}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Confirm password reset for owner
// @route   POST /api/owner/confirmPasswordReset
// @access  Public
const confirmOwnerPasswordReset = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const owner = await Owner.findOne({ email: decoded.email });
    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' });
    }

    owner.password = newPassword;
    await owner.save();
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Invalid or expired token' });
  }
});

const changeAdminRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  // Validate role
  const validRoles = ['root', 'productAdmin', 'orderAdmin', 'inventoryAdmin', 'customerSupportAdmin', 'userAccessAdmin', 'salesAdmin'];
  if (!validRoles.includes(role)) {
    res.status(400);
    throw new Error('Invalid admin role');
  }

  const admin = await Admin.findById(id);

  if (!admin) {
    res.status(404);
    throw new Error('Admin not found');
  }

  admin.role = role;
  await admin.save();

  res.json({ message: 'Admin role updated successfully' });
});

const getAllAdmins = asyncHandler(async (req, res) => {
  const admins = await Admin.find({});
  res.json(admins);
});

const deleteAdmin = asyncHandler(async (req, res) => {
  const adminId = req.params.id;

  // Find the admin by ID and delete it
  const admin = await Admin.findById(adminId);
  if (!admin) {
    res.status(404);
    throw new Error('Admin not found');
  }

  await admin.remove();
  res.json({ message: 'Admin deleted successfully' });
});


export { createOwner, ownerLogin, requestOwnerPasswordReset, confirmOwnerPasswordReset,changeAdminRole,getAllAdmins,deleteAdmin };
