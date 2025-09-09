const mongoose = require('mongoose')

const imageSchema = mongoose.Schema({
    doc_name:{
        type:String,
        default:"adhaar",
        required:[true,'please enter the doc name']
    },
    url:{
        type:String,
        required:[true,'please enter img url']
    },
    public_id:{
        type:String,
        required:[true,"please enter the public id"]
    }
});

const userSchema = mongoose.Schema({
    user_name:{
        type:String,
        required:[true,'name is required']
    },
    user_email:{
        type:String,
        required:[true,'Email id is required'],
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
    
    },
    user_mobile:{
        type:Number,
        required:[true,'must enter phone or mobile number'],
        validate: {
            validator: function (v) {
            return /^\d{10}$/.test(v); // Only allows 10 digits
            },
            message: 'Mobile number must be exactly 10 digits'
        }
    },
    user_idphoto:{
        type:[imageSchema]
    },
    user_address:{
        type:String
    },
    user_username:{
        type:String,
        required:[true,"please enter username"]
    },
    user_role:{
        type:String,
        enum:["Salesman","Packaging","Billing"],
        required: true,
        trim: true,
        default:"user"
    }
},{  timestamps: true  })


module.exports = userSchema;