const mongoose = require('mongoose')

const salesmanSchema = mongoose.Schema({
    salesman_name:{
        type:String,
        required:[true,'Salesman name is required']
    },
    salesman_email:{
        type:String,
        required:[true,'Email id is required'],
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
    
    },
    salesman_password:{
        type:String,
        required:[true,'Password id is required'],
        minlength:[6,'password must be atleast 6 characters']
    },
    salesman_mobile:{
        type:Number,
        required:[true,'must enter phone or mobile number'],
        validate: {
            validator: function (v) {
            return /^\d{10}$/.test(v); // Only allows 10 digits
            },
            message: 'Mobile number must be exactly 10 digits'
        }
    },
    salesman_idphoto:{
        type:[String]
    },
    salesman_address:{
        type:String
    },
    salesman_order_count:{
        type:Number
    },
    salesman_username:{
        type:String,
        required:[true,"please enter username"]
    },
    user_role:{
        type:String,
        enum:['distributer','seller','salesman'],
        required: true,
        lowercase: true, // optional: ensures value is stored in lowercase
        trim: true,
        default:"salesman"
    }
},{  timestamps: true  })


module.exports = salesmanSchema;