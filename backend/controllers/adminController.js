import Admin from '../models/Admin.js';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import nodemailer from 'nodemailer';

const { sign, verify } = jwt;

config();

const generateToken = (id) => {
  return sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Create a new admin user
// @route   POST /api/admin/createAdmin
// @access  Private (only accessible by root users)
const createAdminUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;

  // Check if the admin already exists
  const adminExists = await Admin.findOne({ email });

  if (adminExists) {
    res.status(400);
    throw new Error('Admin already exists');
  }

  // Ensure role is valid
  const validRoles = ['root', 'productAdmin', 'orderAdmin', 'inventoryAdmin', 'customerSupportAdmin', 'userAccessAdmin', 'salesAdmin'];
  if (!validRoles.includes(role)) {
    res.status(400);
    throw new Error('Invalid admin role');
  }

  // Create a new admin user
  const admin = await Admin.create({
    username,
    email,
    password,
    role,
  });

  if (admin) {
    res.status(201).json({
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid admin data');
  }
});

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

// @desc    Request password reset for admin
// @route   POST /api/admin/requestPasswordReset
// @access  Public
const requestAdminPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
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
      subject: 'Admin Password Reset',
      text: `Please click the following link to reset your password: ${process.env.CLIENT_URL}/resetAdminPassword/${token}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Confirm password reset for admin
// @route   POST /api/admin/confirmPasswordReset
// @access  Public
const confirmAdminPasswordReset = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findOne({ email: decoded.email });
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    admin.password = newPassword;
    await admin.save();
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Invalid or expired token' });
  }
});

export { createAdminUser, adminLogin, requestAdminPasswordReset, confirmAdminPasswordReset };
