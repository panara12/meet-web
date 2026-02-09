const mongoose = require('mongoose');
const locationSchema = new mongoose.Schema({
  // Reference to User
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
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