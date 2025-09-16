const mongoose = require('mongoose');

const sellerSchema = mongoose.Schema({
    company_name:{
        type:String,
        required:[true,'Seller name is required']
    },
    primary_email:{
        type:String,
        required:[true,'Email id is required'],
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
    },
    seller_password:{
        type:String,
    },
    phone_number:{
        type:Number,
        required:[true,'must enter phone or mobile number'],
        validate: {
            validator: function (v) {
            return /^\d{10}$/.test(v); // Only allows 10 digits
            },
            message: 'Mobile number must be exactly 10 digits'
        }
    },
    website: {
        type: String,
        required: false,
        validate: {
            validator: function (v) {
            // Skip validation if v is falsy (e.g. "", null, undefined)
            if (!v) return true;

            // Otherwise validate the URL
            return /^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/.test(v);
            },
            message: props => `${props.value} is not a valid URL!`,
        },
    },
    business_address:{
        type:String
    },
    city:{
        type:String,
        required:[true,'city must have to enter']
    },
    client_status:{
        type:String,
        enum:['','active','vip client','inactive','pending']
    },
    business_priority:{
        type:String,
        enum:['','high priority','medium priority','low priority']
    },
    payment_terms:{
        type:String,
    },
    industry:{
        type:String,
    },
    company_size:{
        type:String
    },
    credit_limit:{
        type:String
    },
    primary_contact_person:{
        type:String
    },
    gst_number:{
        type:String
    },
    business_note:{
        type:String
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