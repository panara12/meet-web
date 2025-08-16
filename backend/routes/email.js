const express = require('express');
const router = express.Router();
const { sendContactFormEmail } = require('../utils/emailService');

// POST /email/emailTo - Send contact form email
router.post('/emailTo', async (req, res) => {
  try {
    const { name, email, phone, company, message, productInterest } = req.body;

    // Validation
    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Required fields are missing. Please provide name, email, phone, and message.'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    // Phone validation (basic)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid phone number.'
      });
    }

    // Prepare contact data
    const contactData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      company: company ? company.trim() : '',
      message: message.trim(),
      productInterest: productInterest ? productInterest.trim() : ''
    };

    // Send email
    const result = await sendContactFormEmail(contactData);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Email sent successfully! We will get back to you soon.',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send email. Please try again later.',
        error: result.error
      });
    }

  } catch (error) {
    console.error('Email route error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
      error: error.message
    });
  }
});

// GET /email/emailTo - Health check endpoint
router.get('/emailTo', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Email service is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
