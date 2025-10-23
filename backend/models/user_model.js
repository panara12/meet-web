const mongoose = require('mongoose');

// Document/Image Schema (nested in User)
const imageSchema = new mongoose.Schema({
  doc_name: {
    type: String,
    enum: ['aadhar', 'pan', 'license', 'passport'],
    default: 'aadhar',
    required: [true, 'Please enter the document name']
  },
  url: {
    type: String,
    required: [true, 'Please enter image URL']
  },
  public_id: {
    type: String,
    required: [true, 'Please enter the public ID']
  },
  uploadedDate: {
    type: Date,
    default: Date.now
  }
});

// User Schema
const userSchema = new mongoose.Schema({
  // Employee Information
  employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
    unique: true,
    trim: true
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    validate: {
      validator: function (v) {
        return /^\+?[1-9]\d{1,14}$/.test(v.replace(/\D/g, ''));
      },
      message: 'Please enter a valid phone number'
    }
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  
  // Work Information
  role: {
    type: String,
    enum: ['salesman', 'packaging', 'billing', 'admin', 'manager'],
    required: [true, 'Role is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  hireDate: {
    type: Date,
  },
  salary: {
    type: Number,
    required: [true, 'Salary is required'],
    validate: {
      validator: function (v) {
        return v > 0;
      },
      message: 'Salary must be greater than 0'
    }
  },
  workHours: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract'],
    default: 'Full-time'
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'On Leave', 'Suspended'],
    default: 'Active'
  },
  
  // Account Information
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  
  // Permissions
  permissions: {
    type: [String],
    enum: ['sales_access', 'client_management', 'order_management', 'admin_access', 'report_access'],
    default: ['sales_access']
  },
  
  // Document/Image Information
  documents: {
    type: String,
  },
  
  // Emergency Contact
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  
  // Location Tracking Settings
  locationTracking: {
    isEnabled: {
      type: Boolean,
      default: true
    },
    monthlyRequestsLimit: {
      type: Number,
      default: 20
    }
  },
  
  // Activity Tracking
  lastLogin: {
    type: Date,
    default:null
  },
  notes: {
    type: String
  },
  
  // Soft Delete
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });


module.exports = userSchema;