import asyncHandler from 'express-async-handler';
import Contact from '../models/Contact.js';

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  const contact = new Contact({
    name,
    email,
    message,
  });

  const submittedContact = await contact.save();
  res.status(201).json(submittedContact);
});
