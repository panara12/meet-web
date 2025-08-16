# Email Service Setup Guide

## 🚀 **Setup Instructions:**

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Gmail App Password Setup**
Since you have 2-factor authentication enabled, you need to generate an "App Password":

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to "Security" → "2-Step Verification"
3. Scroll down to "App passwords"
4. Generate a new app password for "Mail"
5. Copy the generated 16-character password

### 3. **Environment Variables**
Add this to your `.env` file:
```env
GMAIL_APP_PASSWORD=your_16_character_app_password_here
```

### 4. **API Endpoint**
- **POST** `/email/emailTo` - Send contact form email
- **GET** `/email/emailTo` - Health check

## 📧 **API Usage:**

### **Frontend Call Example:**
```javascript
const response = await fetch('/email/emailTo', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+919876543210',
    company: 'ABC Company',
    message: 'I am interested in your products',
    productInterest: 'Premium T-Shirt'
  })
});

const result = await response.json();
```

## ✨ **Features:**

- **Gmail SMTP** configuration with your email
- **Professional email templates** with your brand colors
- **Automatic confirmation emails** to users
- **Input validation** (email, phone, required fields)
- **Error handling** and logging
- **Rate limiting** ready for future implementation

## 🔧 **Files Created:**

1. `utils/emailService.js` - Email service configuration
2. `routes/email.js` - API endpoints
3. Updated `package.json` with nodemailer
4. Updated `index.js` with email routes

## ⚠️ **Important Notes:**

- Keep your Gmail app password secure
- The service will send emails to `panaraabhay2@gmail.com`
- Users will receive confirmation emails automatically
- All emails use your brand color scheme (#3b82f6, #1e293b, etc.)

## 🧪 **Testing:**

Test the endpoint with:
```bash
curl -X POST http://localhost:5000/email/emailTo \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","phone":"+919876543210","message":"Test message"}'
```
