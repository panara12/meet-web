const ResetPassword = require("../models/reset_password_model");
const { sendEmail } = require("./emailService");

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Reset password function
const resetPassword = async (email,userData) => {
  console.log(email,userData)
  try {
    // 1. Generate OTP
    const otp = await generateOTP();

    // 2. Store OTP in DB with expiry (5 min)
    const user = await ResetPassword.create(
      {
        user_email:email,
        user_id:userData._id,
        user_otp:otp,
        is_successfull:false,
        otp_expiry:Date.now() + 5 * 60 * 1000
      });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    // 3. Prepare email template
    const subject = "Password Reset OTP";
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color:#333;">Password Reset Request</h2>
        <p>Hello <b>${userData.user_username || "User"}</b>,</p>
        <p>We received a request to reset your password. Use the OTP below to proceed:</p>
        
        <h3 style="color:#d9534f; font-size:24px; letter-spacing:2px;">${otp}</h3>
        
        <p>This OTP is valid for <b>5 minutes</b>. If you did not request a password reset, please ignore this email.</p>
        <br/>
        <p>Thanks,<br/>Your App Team</p>
      </div>
    `;

    // 4. Send Email
    const result = await sendEmail(email, subject, htmlContent);

    return {
      success: true,
      message: "OTP sent to email",
      emailResult: result,
      userdata:{user:userData,otp:otp}
    };
  } catch (error) {
    console.error("Reset Password Error:", error);
    return { success: false, error: error.message };
  }
};

module.exports = resetPassword