# Frontend Email Service Setup Guide

## 🚀 **What's Been Added:**

### 1. **Email Service Utility** (`src/utils/emailService.js`)
- Axios-based email service
- Error handling and response formatting
- Health check functionality
- Uses your backend URL configuration

### 2. **Updated Contact Component** (`src/routes/Contact.jsx`)
- Integrated with email service
- Loading states and form validation
- Success/error messages
- Form submission handling
- Disabled states during submission

### 3. **Email Testing Utility** (`src/utils/emailTest.js`)
- Console-based testing functions
- Health check testing
- Test email sending

### 4. **Updated URL Configuration** (`src/utils/Url.jsx`)
- Set to `localhost:5000` for development
- Ready for production switch

## 🧪 **Testing the Email Service:**

### **Method 1: Browser Console Testing**
1. Open your browser console on the contact page
2. Run these commands:
```javascript
// Test health check
window.testEmailService().then(console.log)

// Or test individual functions
import { emailService } from '/src/utils/emailService.js'
emailService.testEmailService().then(console.log)
```

### **Method 2: Contact Form Testing**
1. Fill out the contact form
2. Submit and check console for API calls
3. Verify email delivery to `panaraabhay2@gmail.com`

### **Method 3: Network Tab Testing**
1. Open browser DevTools → Network tab
2. Submit contact form
3. Check the `/email/emailTo` request/response

## 🔧 **Backend Requirements:**

Make sure your backend is running with:
1. **Gmail App Password** set in `.env`
2. **Nodemailer** installed (`npm install`)
3. **Email routes** active
4. **Server running** on port 5000

## 📧 **API Endpoints:**

- **POST** `http://localhost:5000/email/emailTo` - Send contact form
- **GET** `http://localhost:5000/email/emailTo` - Health check

## ✨ **Features:**

- **Real-time form validation**
- **Loading states** during submission
- **Success/error messages** with auto-hide
- **Form reset** after successful submission
- **Disabled form** during submission
- **Professional error handling**
- **Console logging** for debugging

## 🐛 **Troubleshooting:**

### **Common Issues:**

1. **CORS Error**: Ensure backend has CORS enabled
2. **Connection Refused**: Check if backend is running on port 5000
3. **Email Not Sending**: Verify Gmail app password in backend `.env`
4. **Form Not Submitting**: Check browser console for errors

### **Debug Steps:**

1. Check browser console for errors
2. Verify backend server is running
3. Test health check endpoint
4. Check network tab for failed requests
5. Verify environment variables in backend

## 🚀 **Next Steps:**

1. **Start your backend server** on port 5000
2. **Set Gmail app password** in backend `.env`
3. **Test the contact form** on your frontend
4. **Check email delivery** to `panaraabhay2@gmail.com`
5. **Monitor console logs** for debugging

## 📱 **Usage Example:**

```javascript
import { emailService } from '../utils/emailService';

// Send contact form email
const result = await emailService.sendContactEmail({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+919876543210',
  company: 'ABC Company',
  message: 'I am interested in your products',
  productInterest: 'Premium T-Shirt'
});

if (result.success) {
  console.log('Email sent:', result.message);
} else {
  console.error('Failed:', result.message);
}
```

Your email service is now fully integrated and ready for testing! 🎉
