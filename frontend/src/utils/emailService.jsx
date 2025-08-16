import axios from 'axios';
import uri from './Url';

// Create axios instance with base configuration
const emailAPI = axios.create({
  baseURL: uri,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'x-tenent-domain':'bhavya_marketing'
  },
});

// Email service functions
export const emailService = {
  // Send contact form email
  sendContactEmail: async (contactData) => {
    try {
      const response = await emailAPI.post('/email/emailTo', contactData);
      return {
        success: true,
        data: response.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Email sending error:', error);
      
      if (error.response) {
        // Server responded with error status
        return {
          success: false,
          message: error.response.data.message || 'Failed to send email',
          error: error.response.data.error || 'Unknown error'
        };
      } else if (error.request) {
        // Request was made but no response received
        return {
          success: false,
          message: 'No response from server. Please check your connection.',
          error: 'Network error'
        };
      } else {
        // Something else happened
        return {
          success: false,
          message: 'An unexpected error occurred.',
          error: error.message
        };
      }
    }
  },

  // Test email service health
  testEmailService: async () => {
    try {
      const response = await emailAPI.get('/email/emailTo');
      return {
        success: true,
        data: response.data,
        message: 'Email service is running'
      };
    } catch (error) {
      console.error('Email service test error:', error);
      return {
        success: false,
        message: 'Email service is not responding',
        error: error.message
      };
    }
  }
};

// Export the axios instance for custom usage if needed
export { emailAPI };
export default emailService;
