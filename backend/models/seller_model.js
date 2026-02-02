const { create } = require('connect-mongo');
const mongoose = require('mongoose');

const sellerSchema = mongoose.Schema({
    // Required fields
    name: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v.replace(/\D/g, '')); // Allows 10 digits
            },
            message: 'Phone number must be 10 digits'
        }
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true
    },
    contactPerson: {
        type: String,
        required: [false, 'Contact person name is required'],
        trim: true
    },

    // Nullable fields with defaults
    username:{
        type: String,
        default: null
    },
    password: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['Active', 'VIP', 'Inactive', 'Pending'],
        default: 'active'
    },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: "Medium"
    },
    paymentTerms: {
        type: String,
        default: null
    },
    gstNumber: {
        type: String,
        default: null
    },
    creditLimit: {
        type: String,
        default: null
    },
    pendingOrders:{
        type:Number,
        default:0
    },
    totalOrders: {
        type: Number,
        default:0
    },
    totalSpent: {
        type: String,
        default: "0"
    },
    lastOrder: {
        type: Date,
        default: null
    },
    notes: {
        type: String,
        default: null
    },
    userRole: {
        type: String,
        enum: ['seller'],
        default: 'seller',
        trim: true
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = sellerSchema;