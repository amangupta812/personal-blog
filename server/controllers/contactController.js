import Contact from '../models/Contact.js';

// @desc    Submit contact message
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields (name, email, subject, message) are required.',
      });
    }

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
      contact,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all contact messages (Admin)
// @route   GET /api/contact/admin/all
// @access  Private/Admin
export const getContactMessages = async (req, res, next) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark contact message as read
// @route   PATCH /api/contact/admin/:id/read
// @access  Private/Admin
export const markContactAsRead = async (req, res, next) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    message.isRead = true;
    await message.save();

    res.status(200).json({
      success: true,
      message,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contact/admin/:id
// @access  Private/Admin
export const deleteContactMessage = async (req, res, next) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
