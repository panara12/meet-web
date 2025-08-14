const mongoose = require('mongoose')

const companySchema = mongoose.Schema({
    company_name:{
        type:String,
        required:[true,"please enter the company details"]
    }
},{  timestamps: true  })

module.exports = companySchema;