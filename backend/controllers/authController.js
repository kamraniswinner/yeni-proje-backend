import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import User from '../models/User.js'; 
import nodemailer from 'nodemailer';
const { sign } = jwt;

config();

const generateToken = (id) => {
  return sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export async function registerUser(req, res) {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
}

export async function authUser(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);
      
      // Log the token
      console.log("User token:", token);

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: token,
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
}

export async function requestPasswordReset(req, res){
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send email with password reset link containing token
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      text: `Please click the following link to reset your password: ${process.env.CLIENT_URL}/resetPassword/${token}`
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export async function confirmPasswordReset (req, res){
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Invalid or expired token' });
  }
};

export async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function getAllUsers(req, res) {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}