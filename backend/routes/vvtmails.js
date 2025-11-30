// Import email service
const nodemailer = require('nodemailer');
const router = require('express').Router();

// Schedule call endpoint - Everything in one function
router.post('/schedule-call', async (req, res) => {
  try {
    const mailInfo = req.body;
    console.log('Received:', mailInfo);
    
    // Validate required fields
    if (!mailInfo.userName || !mailInfo.userEmail || !mailInfo.userPhone || 
        !mailInfo.selectedDate || !mailInfo.selectedTime) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.VVT_SMTP_HOST,
      port: process.env.VVT_SMTP_PORT,
      secure: process.env.VVT_SMTP_SECURE === 'true',
      auth: {
        user: process.env.VVT_EMAIL_USER,
        pass: process.env.VVT_EMAIL_PASSWORD,
      },
    });

    // Format the date nicely
    const date = new Date(mailInfo.selectedDate);
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Company Email HTML
    const companyEmailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #f9f9f9;
            padding: 30px;
            border: 1px solid #ddd;
          }
          .info-box {
            background: white;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #667eea;
            border-radius: 5px;
          }
          .info-row {
            margin: 10px 0;
            display: flex;
            justify-content: space-between;
          }
          .label {
            font-weight: bold;
            color: #667eea;
          }
          .value {
            color: #333;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 12px;
          }
          .highlight {
            background: #667eea;
            color: white;
            padding: 15px;
            border-radius: 5px;
            text-align: center;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🗓️ New Call Scheduled!</h1>
        </div>
        <div class="content">
          <p>You have a new call scheduling request from a potential client.</p>
          
          <div class="highlight">
            <h2 style="margin: 0;">📅 ${formattedDate}</h2>
            <h3 style="margin: 10px 0 0 0;">🕐 ${mailInfo.selectedTime}</h3>
          </div>

          <div class="info-box">
            <h3 style="margin-top: 0; color: #667eea;">Client Information</h3>
            <div class="info-row">
              <span class="label">Name:</span>
              <span class="value">${mailInfo.userName}</span>
            </div>
            <div class="info-row">
              <span class="label">Email:</span>
              <span class="value">${mailInfo.userEmail}</span>
            </div>
            <div class="info-row">
              <span class="label">Phone:</span>
              <span class="value">${mailInfo.userPhone}</span>
            </div>
            ${mailInfo.company ? `
            <div class="info-row">
              <span class="label">Company:</span>
              <span class="value">${mailInfo.company}</span>
            </div>
            ` : ''}
            ${mailInfo.serviceInterest ? `
            <div class="info-row">
              <span class="label">Service Interest:</span>
              <span class="value">${mailInfo.serviceInterest}</span>
            </div>
            ` : ''}
          </div>

          ${mailInfo.message ? `
          <div class="info-box">
            <h3 style="margin-top: 0; color: #667eea;">Client Message</h3>
            <p style="margin: 0;">${mailInfo.message}</p>
          </div>
          ` : ''}

          <p style="margin-top: 30px; color: #666;">
            <strong>Action Required:</strong> Please add this appointment to your calendar and prepare for the call.
          </p>
        </div>
        <div class="footer">
          <p>This email was generated automatically from your website's call scheduling system.</p>
        </div>
      </body>
      </html>
    `;

    // User Email HTML
    const userEmailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #f9f9f9;
            padding: 30px;
            border: 1px solid #ddd;
          }
          .confirmation-box {
            background: white;
            padding: 25px;
            margin: 20px 0;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .date-time {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
          }
          .info-item {
            margin: 15px 0;
            padding: 10px;
            border-left: 3px solid #667eea;
            padding-left: 15px;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 12px;
          }
          .checkmark {
            font-size: 48px;
            color: #4CAF50;
            text-align: center;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>✨ Call Scheduled Successfully!</h1>
        </div>
        <div class="content">
          <div class="checkmark">✓</div>
          
          <p>Dear ${mailInfo.userName},</p>
          
          <p>Thank you for scheduling a consultation call with us! We're excited to discuss your project and how we can help bring your vision to life.</p>

          <div class="date-time">
            <h2 style="margin: 0; font-size: 24px;">📅 ${formattedDate}</h2>
            <h3 style="margin: 10px 0 0 0; font-size: 20px;">🕐 ${mailInfo.selectedTime}</h3>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Duration: 30 minutes</p>
          </div>

          <div class="confirmation-box">
            <h3 style="margin-top: 0; color: #667eea;">Your Appointment Details</h3>
            
            <div class="info-item">
              <strong>Name:</strong> ${mailInfo.userName}
            </div>
            <div class="info-item">
              <strong>Email:</strong> ${mailInfo.userEmail}
            </div>
            <div class="info-item">
              <strong>Phone:</strong> ${mailInfo.userPhone}
            </div>
            ${mailInfo.company ? `
            <div class="info-item">
              <strong>Company:</strong> ${mailInfo.company}
            </div>
            ` : ''}
            ${mailInfo.serviceInterest ? `
            <div class="info-item">
              <strong>Service Interest:</strong> ${mailInfo.serviceInterest}
            </div>
            ` : ''}
          </div>

          <div style="background: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #667eea;">📞 What to Expect:</h4>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>We'll call you at <strong>${mailInfo.userPhone}</strong></li>
              <li>The call will last approximately 30 minutes</li>
              <li>We'll discuss your requirements and answer your questions</li>
              <li>You'll receive a follow-up email with next steps</li>
            </ul>
          </div>

          <p><strong>Need to reschedule?</strong> Please reply to this email at least 24 hours before the scheduled time.</p>

          <p style="margin-top: 30px;">We look forward to speaking with you!</p>

          <p style="color: #667eea; font-weight: bold;">Best regards,<br>Void Vortex Tech Team</p>
        </div>
        <div class="footer">
          <p>If you have any questions before the call, feel free to reply to this email.</p>
          <p style="color: #999; margin-top: 10px;">© 2025 Void Vortex Tech. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    // Company email options
    const companyMailOptions = {
      from: `"Void Vortex Tech" <${process.env.VVT_EMAIL_USER}>`,
      to: process.env.VVT_EMAIL_USER,
      subject: `🗓️ New Call Scheduled - ${mailInfo.userName} (${formattedDate})`,
      html: companyEmailHTML,
      text: `New call scheduled with ${mailInfo.userName} on ${formattedDate} at ${mailInfo.selectedTime}. Contact: ${mailInfo.userEmail}, ${mailInfo.userPhone}`,
    };

    // User email options
    const userMailOptions = {
      from: `"Void Vortex Tech" <${process.env.VVT_EMAIL_USER}>`,
      to: mailInfo.userEmail,
      subject: `✅ Call Confirmed - ${formattedDate} at ${mailInfo.selectedTime}`,
      html: userEmailHTML,
      text: `Dear ${mailInfo.userName}, your call has been scheduled for ${formattedDate} at ${mailInfo.selectedTime}. We'll call you at ${mailInfo.userPhone}. Looking forward to speaking with you!`,
    };

    // Send both emails
    console.log('Sending emails...');
    
    const companyEmailResult = await transporter.sendMail(companyMailOptions);
    console.log('Company email sent:', companyEmailResult.messageId);
    
    const userEmailResult = await transporter.sendMail(userMailOptions);
    console.log('User email sent:', userEmailResult.messageId);

    // Send success response
    res.json({ 
      success: true, 
      message: 'Emails sent successfully',
      companyEmailId: companyEmailResult.messageId,
      userEmailId: userEmailResult.messageId
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send emails',
      error: error.message
    });
  }
});

module.exports = router;