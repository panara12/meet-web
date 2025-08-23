const mongoose = require('mongoose')

const user_tenent_Schema = mongoose.Schema({

    user_email:{
        type:String,
        required:[true,'Email id is required'],
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
    },
    user_password:{
        type:String,
        required:[true,'Password id is required'],
        minlength:[6,'password must be atleast 6 characters']
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


module.exports = user_tenent_Schema;