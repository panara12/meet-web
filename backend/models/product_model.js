const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    product_name:{
        type:String,
        required:[true,'product name is required']
    },
    product_company:{
        type:String,
        required:[true,'company name is required']
    },
    product_size:{
        type:[String]
    },
    product_color:{
        type:[String]
    },
    product_type:{
        type:String
    },
    product_stock:{
        type:Boolean
    },
    product_price:{
        type:String
    },
    product_photos:{
        type:[String]
    },
    product_firm:{
        type:String
    }
},{  timestamps: true  })


module.exports = productSchema;