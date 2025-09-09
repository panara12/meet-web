const mongoose = require('mongoose')

const sellerSchema = mongoose.Schema({
    seller_name:{
        type:String,
        required:[true,'Seller name is required']
    },
    seller_email:{
        type:String,
        required:[true,'Email id is required'],
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
    },
    seller_mobile:{
        type:Number,
        required:[true,'must enter phone or mobile number'],
        validate: {
            validator: function (v) {
            return /^\d{10}$/.test(v); // Only allows 10 digits
            },
            message: 'Mobile number must be exactly 10 digits'
        }
    },
    seller_address:{
        type:String
    },
    seller_area:{
        type:String
    },
    seller_city:{
        type:String,
        required:[true,'city must have to enter']
    },
    seller_username:{
        type:String,
        required:[true,'please enter the username without space']
    },
    user_role:{
        type:String,
        enum:['Seller'],
        required: true, // optional: ensures value is stored in lowercase
        trim: true,
        default:"Seller"
    }
},{  timestamps: true  })

module.exports = sellerSchema;