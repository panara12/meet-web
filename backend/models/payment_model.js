const mongoose = require('mongoose')

const paymentSchema  =  mongoose.Schema({
    payment_client : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"seller"
    },
    payment_salesman:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"salesman"
    },
    payment_amount:{
        type:String,
        required:[true,"please enter the amount if not than zero"]
    },
    payment_type:{
        type:String,
        enum:['cash','cheque','online']
    },
    payment_date:{
        type:String,
        required:[true,"please enter the date"]
    },
    payment_state:{
        type:String,
        enum:['pending','collected'],
        default:"pending"
    },
    order_with_payment:{
        type:Boolean,
        default:false
    }
},{  timestamps: true  })

module.exports = paymentSchema