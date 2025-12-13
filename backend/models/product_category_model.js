const mongoose  = require("mongoose");

const productCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
    },
    lgst:{
        type: String,
    },
    sgst:{
        type: String,
    },
    cgst:{
        type: String,
    },
    other:{
        type: String,
        default:null
    }
}, { timestamps: true });

module.exports =  productCategorySchema;