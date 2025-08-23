import axios from 'axios';
import { API_BASE_URL } from '../utils/Url';

// Get user profile data
export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/profile`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update user profile data
export const updateUserProfile = async (userData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/user/profile`, userData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get user plan details
export const getUserPlan = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/plan`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Mock plan data structure for development
export const getMockPlanData = () => {
  return {
    planName: "Business Pro",
    planType: "Annual",
    startDate: "2024-01-15",
    expiryDate: "2025-01-15",
    price: "₹24,999",
    status: "active",
    features: [
      {
        id: "oms",
        name: "OMS (Order Management System)",
        included: true,
        description: "Complete order processing and management",
        icon: "📦"
      },
      {
        id: "tracker",
        name: "Tracker",
        included: true,
        description: "Real-time tracking and analytics",
        icon: "📊"
      },
      {
        id: "payment",
        name: "Payment Gateway",
        included: true,
        description: "Integrated payment processing",
        icon: "💳"
      },
      {
        id: "analytics",
        name: "Advanced Analytics",
        included: false,
        description: "Advanced reporting and insights",
        icon: "📈"
      },
      {
        id: "api",
        name: "API Access",
        included: false,
        description: "REST API for integrations",
        icon: "🔌"
      },
      {
        id: "support",
        name: "Priority Support",
        included: false,
        description: "24/7 priority customer support",
        icon: "🎧"
      }
    ],
    billing: {
      nextBillingDate: "2025-01-15",
      autoRenew: true,
      paymentMethod: "Credit Card ending in 1234"
    }
  };
};

// Mock user profile data for development
export const getMockUserProfile = () => {
  return {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    company: "Tech Solutions Ltd",
    address: "123 Business Park, Tech Street",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    avatar: null,
    preferences: {
      notifications: {
        email: true,
        sms: false,
        push: true
      },
      language: "en",
      timezone: "Asia/Kolkata"
    }
  };
};
