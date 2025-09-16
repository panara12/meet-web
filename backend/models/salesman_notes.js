const mongoose = require('mongoose');

const salesman_notes = new mongoose.Schema({

  salesman_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  type: {
    type: String,
    required: true,
    enum: ['target', 'follow-up', 'reminder', 'meeting', 'note'],
    default: 'note'
  },
  
  title: {
    type: String,
    required: true,
    trim: true
  },
  
  content: {
    type: String,
    required: true,
    trim: true
  },
  
  color: {
    type: String,
    enum: ['blue', 'green', 'yellow', 'purple', 'red'],
    default: 'blue'
  },
  
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = salesman_notes;