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
        type:Number,
        required:[true,"please enter product quantity"]
    },
    size:{
        type:String,
        required:[true,"please enter product sizes"]
    },
    subtotal:{
        type:Number,
        default:null
    },
    instructions:{
        type:String,
        default:""
    },
    color:{
        type:String,
        default:"default"
    }
}

const client = {
    seller_data : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Seller"
    },
    items:[item]
}

const cartSchema = mongoose.Schema({
    salesman_data:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    clients:[client]
},{  timestamps: true  })

module.exports = cartSchema;