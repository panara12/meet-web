const mongoose = require('mongoose')

const distributerSchema = mongoose.Schema({
    distributer_name : {
        type: String,
        required:[true,'please enter distributer name']
    },
    distributer_mobile :{
        type: Number,
        required:[true,'please enter mobile number'],
        validate: {
            validator: function (v) {
            return /^\d{10}$/.test(v); // Only allows 10 digits
            },
            message: 'Mobile number must be exactly 10 digits'
        }
    },
    distributer_email : {
        type : String,
        required:[true,'please enter email address'],
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
    },
    distributer_firms:{
        type : [String]
    },
    distributer_city: {
        type : String
    },
    distributer_username:{
        type : String,
        required:[true,'please enter username']
    },
    distributer_plan:{
        type : String,
        required:[true,'please enter the plan name'],
        enum:['bronze','silver','gold','platinum']
    },
    user_tenant:{
        type:String,
        required:[true,"please enter user tenant name"]
    },
    user_role:{
        type:String,
        enum:['Distributer','Seller','Salesman'],
        required: true,
        trim: true,
        default:"Distributer"
    }
},{  timestamps: true  });


module.exports = distributerSchema ;