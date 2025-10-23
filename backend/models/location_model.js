const mongoose = require('mongoose');
const locationSchema = new mongoose.Schema({
  // Reference to User
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  
  // Location Details
  latitude: {
    type: Number,
    required: [true, 'Latitude is required'],
    validate: {
      validator: function (v) {
        return v >= -90 && v <= 90;
      },
      message: 'Latitude must be between -90 and 90'
    }
  },
  longitude: {
    type: Number,
    required: [true, 'Longitude is required'],
    validate: {
      validator: function (v) {
        return v >= -180 && v <= 180;
      },
      message: 'Longitude must be between -180 and 180'
    }
  },
  locationName: {
    type: String,
    required: [true, 'Location name is required']
  },
  accuracy: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Tracking Info
  tenantName: {
    type: String,
    required: [true, 'Tenant/Company name is required']
  },
  
  // Geo-spatial Index for efficient queries
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      validate: {
        validator: function (v) {
          return v && v.length === 2 && 
                 v[0] >= -180 && v[0] <= 180 && 
                 v[1] >= -90 && v[1] <= 90;
        },
        message: 'Invalid coordinates'
      }
    }
  },
  
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Create geospatial index for location queries
locationSchema.index({ coordinates: '2dsphere' });
locationSchema.index({ userId: 1, createdAt: -1 });

module.exports = locationSchema;