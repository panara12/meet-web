const mongoose = require('mongoose')

const user_tenent_Schema = mongoose.Schema({

    user_email:{
        type:String,
        required:[true,'Email id is required'],
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
    },
    user_username:{
        type:String,
        required:[true,"please enter the username"]
    },
    user_password:{
        type:String,
        required:[true,'Password id is required'],
        minlength:[6,'password must be atleast 6 characters']
    },
    user_role:{
        type:String,
        enum:["Distributer","Salesman","Packaging","Billing","Seller"],
        required: true,
        trim: true,
    },
    user_tenant:{
        type:String,
        required:[true,"please enter the tenant name"]
    }
},{  timestamps: true  })


const tenent_user_master = mongoose.model('tenant_user_master',user_tenent_Schema);
module.exports = tenent_user_master