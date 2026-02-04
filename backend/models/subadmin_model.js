const mongoose = require('mongoose');

const logs = new mongoose.Schema({
  login_time: {
    type: Date,
    default: Date.now
  },
  logout_time: {
    type: Date,
    default: null
  }
},{ _id: true });

const SubadminSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password : {
        type: String,
        required: true,
    },
    log_history : {
        type: [logs],
        default: []
    }
});

module.exports = SubadminSchema