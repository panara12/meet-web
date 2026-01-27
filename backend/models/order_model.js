const mongoose = require('mongoose');

const item = {
    id:{
        type:String,
        required:true
    },
    product_data:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },
    quantity:{
        type:String,
        required:[true,"please enter product quantity"]
    },
    size:{
        type:String,
        required:[true,"please enter product sizes"]
    },
    subtotal:{
        type:String,
        default:null
    },
    instructions:{
        type:String,
        default:""
    },
    color:{
        type:String,
        default:"default"
    },
    sentToBilling:{
        type:Boolean,
        default:false
    },
    cartoonCount:{
        type:Number,
        default:0
    }
}

const orderSchema = mongoose.Schema({
    order_id:{
        type:String,
        required:[true,"please enter the order id"]
    },
    order_seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Seller"
    },
    order_salesman:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Salesman"
    },
    status:{
        type:String,
        enum:['pending','processing','completed']
    },
    order_firm:{
        type:String,
        default:null
    },
    date:{
        type:Date,
        default:Date.now
    },
    totalItems:{
        type:String,
        default:null
    },
    totalAmount:{
        type:String,
        default:null
    },
    items:[item]
},{  timestamps: true  })


module.exports = orderSchema;