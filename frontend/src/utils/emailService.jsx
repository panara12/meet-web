import axios from 'axios';
import apiHelper from './Url';


  // Send Otp for forgot the password
  const sendForgotPasswordEmail = async ({email}) => {
    try {
      const response = await apiHelper.post('/auth/forgotpassword', {email});
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
  };

// Export the axios instance for custom usage if needed
export default sendForgotPasswordEmail;
