const nodemailer = require('nodemailer');

// Gmail SMTP Configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'panaraabhay2@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD // You'll need to set this environment variable
  }
});

// Email template for contact form
const createContactEmailTemplate = (data) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #1e293b; margin-bottom: 20px; text-align: center;">New Contact Form Submission</h2>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #3b82f6; margin-bottom: 15px;">Contact Information</h3>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Company:</strong> ${data.company || 'Not provided'}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #3b82f6; margin-bottom: 15px;">Product Interest</h3>
          <p><strong>Product:</strong> ${data.productInterest || 'General inquiry'}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #3b82f6; margin-bottom: 15px;">Message</h3>
          <p style="background-color: #f1f5f9; padding: 15px; border-radius: 5px; line-height: 1.6;">${data.message}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 14px;">This email was sent from Bhavya Marketing contact form</p>
          <p style="color: #64748b; font-size: 14px;">Timestamp: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
        </div>
      </div>
    </div>
  `;
};

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

// Send contact form email
const sendContactFormEmail = async (contactData) => {
  try {
    const emailTemplate = createContactEmailTemplate(contactData);
    const subject = `New Contact Form Submission - ${contactData.name}`;
    
    // Send to your email
    const result = await sendEmail('panaraabhay2@gmail.com', subject, emailTemplate);
    
    // Also send a confirmation email to the user
    if (result.success) {
      const userConfirmationTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1e293b; margin-bottom: 20px; text-align: center;">Thank You for Contacting Us!</h2>
            <p style="color: #64748b; line-height: 1.6; margin-bottom: 20px;">Dear ${contactData.name},</p>
            <p style="color: #64748b; line-height: 1.6; margin-bottom: 20px;">We have received your message and will get back to you within 24 hours.</p>
            <p style="color: #64748b; line-height: 1.6; margin-bottom: 20px;">If you have any urgent queries, please call us at +91 98765 43210.</p>
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 14px;">Best regards,</p>
              <p style="color: #3b82f6; font-weight: bold; font-size: 16px;">Bhavya Marketing Team</p>
            </div>
          </div>
        </div>
      `;
      
      await sendEmail(contactData.email, 'Thank you for contacting Bhavya Marketing', userConfirmationTemplate);
    }
    
    return result;
  } catch (error) {
    console.error('Contact form email error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  sendEmail,
  sendContactFormEmail,
  transporter
};
