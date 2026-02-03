const mongoose = require('mongoose')

const payment_status = {
    status:{
        type:String,
        enum:['pending','approved','rejected'],
        default:'pending'
    },
    date:{
        type:Date,
        default:Date.now
    },
    adminId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Distributer"
    },
    notes:{
        type:String,
        default:""
    }
}

const paymentSchema  =  mongoose.Schema({
    payment_client : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Seller"
    },
    payment_salesman:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    payment_amount:{
        type:Number,
        required:[true,"please enter the amount if not than zero"]
    },
    payment_type:{
        type:String,
        enum:['cash','cheque','online']
    },
    order_with_payment:{
        type:Boolean,
        default:false
    },
    status:[payment_status]
},{  timestamps: true  })

module.exports = paymentSchema