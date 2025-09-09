const nodemailer = require('nodemailer');

// Gmail SMTP Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'panaraabhay2@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD // You'll need to set this environment variable
  }
});



// Send email function
const sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: 'panaraabhay2@gmail.com',
      to: to,
      subject: subject,
      html: htmlContent
    };

    const result = await transporter.sendMail(mailOptions);
    return {
      success: true,
      messageId: result.messageId,
      message: 'Email sent successfully'
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};



module.exports = {
  sendEmail,
  transporter
};
