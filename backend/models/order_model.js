const mongoose = require('mongoose');
const product_model = require('./product_model');

const orderSchema = mongoose.Schema({
    order_party_name:{
        type:String
    },
    order_date:{
        type:Date
    },
    order_salesman:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'salesman_model',
        required: true
    },
    order_items:[{
        product_details:{type:mongoose.Schema.Types.ObjectId,ref:'product_model'},
        product_size:{type:String,required: true},
        product_color:{type:String,required: true},
        product_quantity: { type: Number, required: true }
    }],
    order_total_amount:{
        type:String
    },
    order_firm:{
        type:String
    }
},{  timestamps: true  })


module.exports = orderSchema;