const mongoose = require('mongoose');

const logs = {
    login_time: {
        type: Date,
        required: true,
    },
    logout_time: {
        type: Date,
        required: false,
    }
};

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