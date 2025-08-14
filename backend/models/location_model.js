const mongoose = require('mongoose')

const locationSchema = mongoose.Schema({
    user_id:{
        type:String,
        required:[true,"please enter user id"]
    },
    tenent_name:{
        type:String,
        required:[true,"please enter tenent name"]
    },
    lat:{
        type:String,
    },
    lng:{
        type:String,
    },
    location_name:{
        type:[String]
    },
    accuracy:{
        type:String
    }
},{  timestamps: true  })


module.exports = locationSchema;