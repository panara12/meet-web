const mongoose = require('mongoose');
const product_model = require('./product_model');

const product_list_schema = mongoose.Schema({
        product_details:{type:mongoose.Schema.Types.ObjectId,ref:'product_model'},
        product_size:{type:String,required: true},
        product_color:{type:String},
        is_packed:{type:Boolean},
        product_quantity: { type: Number, required: true }
    })

const carton = mongoose.Schema({
    count:{
        type:Number,
        default:0
    },
    items:[product_list_schema]
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
    order_items:[product_list_schema],
    order_cartoons:[carton],
    order_total_amount:{
        type:String
    },
    order_status:{
        type:String,
        default:"draft",
        enum: ["draft","pending", "partial pending","billing", "completed"],
    },
    order_firm:{
        type:String
    }
},{  timestamps: true  })


module.exports = orderSchema;