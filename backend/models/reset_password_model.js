const mongoose = require('mongoose')

const resetPasswordSchema = mongoose.Schema({

    user_email:{
        type:String,
        required:[true,'Email id is required'],
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
    },
    user_id:{
        type:String,
        required:[true,"please give the user id"]
    },
    user_otp:{
        type:String,
        required:[true,'otp id is required']
    },
    is_successfull:{
        type:Boolean,
        default:false
    },
    otp_expiry:{
        type:Date,
        default:Date.now() + 5 * 60 * 1000 //5 mins
    }
},{  timestamps: true  })


const ResetPassword = mongoose.model('resetPassword',resetPasswordSchema);
module.exports = ResetPassword