import { emailService } from './emailService';

// Test email service functionality
export const testEmailService = async () => {
  console.log('🧪 Testing Email Service...');
  
  try {
    // Test 1: Health Check
    console.log('📡 Testing health check...');
    const healthResult = await emailService.testEmailService();
    console.log('Health Check Result:', healthResult);
    
    // Test 2: Send Test Email
    console.log('📧 Testing email sending...');
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+919876543210',
      company: 'Test Company',
      message: 'This is a test message from the frontend email service.',
      productInterest: 'Test Product'
    };
    
    const emailResult = await emailService.sendContactEmail(testData);
    console.log('Email Send Result:', emailResult);
    
    return {
      health: healthResult,
      email: emailResult
    };
    
  } catch (error) {
    console.error('❌ Email service test failed:', error);
    return {
      error: error.message
    };
  }
};

// Quick test function for console
export const quickTest = () => {
  console.log('🚀 Quick Email Service Test');
  console.log('Run this in browser console:');
  console.log('import { testEmailService } from "/src/utils/emailTest.js"');
  console.log('testEmailService().then(console.log)');
};

// Export for easy access in console
if (typeof window !== 'undefined') {
  window.testEmailService = testEmailService;
  window.quickTest = quickTest;
}
