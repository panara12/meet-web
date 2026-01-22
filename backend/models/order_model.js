// const mongoose = require('mongoose');
// const product_model = require('./product_model');

// const item = {
    
// };

// const orderSchema = mongoose.Schema({
//     orderNumber:{
//         type:String,
//         required:[true,"please enter the order id"]
//     },
//     order_client:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"Seller"
//     },
//     order_salesman:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"Salesman"
//     },
//     status:{
//         type:String,
//         enum:['pending','processing','completed']
//     },
//     date:{
//         type:Date,
//         default:Date.now
//     },
//     totalItems:{
//         type:String,
//         default:null
//     },
//     totalAmount:{
//         type:String
//     },
//     items:[item]
// },{  timestamps: true  })


// module.exports = orderSchema;