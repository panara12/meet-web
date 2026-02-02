const nodemailer = require('nodemailer');

// Gmail SMTP Configuration
const transporter = nodemailer.createTransport({
  host: process.env.VVT_SMTP_HOST,
      port: process.env.VVT_SMTP_PORT,
      secure: process.env.VVT_SMTP_SECURE === 'true',
      auth: {
        user: process.env.VVT_EMAIL_USER,
        pass: process.env.VVT_EMAIL_PASSWORD,
      },
});



// Send email function
const sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: `"OMS Support" <${process.env.VVT_EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: htmlContent
    };
    console.log('Sending email with options:', mailOptions);
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent:', result);
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
