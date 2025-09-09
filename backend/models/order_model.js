const mongoose = require('mongoose');
const product_model = require('./product_model');

const pending_product_list_schema = mongoose.Schema({
        pending_product_details:{type:mongoose.Schema.Types.ObjectId,ref:'product_model'},
        pending_product_size:{type:String,required: true},
        pending_product_color:{type:String},
        pending_product_quantity: { type: Number, required: true }
    })

const fullfilled_product_list_schema = mongoose.Schema({
        fullfilled_product_details:{type:mongoose.Schema.Types.ObjectId,ref:'product_model'},
        fullfilled_product_size:{type:String},
        fullfilled_product_color:{type:String},
        fullfilled_product_quantity: { type: Number }
    })

const orderSchema = mongoose.Schema({
    order_id:{
        type:String,
        required:[true,"please enter the order id"]
    },
    order_seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Seller"
    },
    order_date:{
        type: Date, 
        default: Date.now
    },
    order_salesman:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    order_items:[pending_product_list_schema,fullfilled_product_list_schema],
    order_total_amount:{
        type:String
    },
    order_status:{
        type:String,
        enum: ["pending", "partial pending","billing", "completed"],
    },
    order_firm:{
        type:String
    }
},{  timestamps: true  })


module.exports = orderSchema;