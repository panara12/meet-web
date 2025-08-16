const mongoose = require('mongoose');

const tenentSchema = mongoose.Schema({
    
    D_name : {
        type:String,
        required:[true,"please enter distributer name"]
    },
    D_domain:{
        type:String,
        required:[true,"please enter domain name"]
    },
    D_dbname:{
        type:String,
        required:[true,"please enter db name"]
    },
    D_plan:{
        type:String,
        required:[true,"please enter plan name"]
    },
    D_payment:{
        type:String,
        required:[true,"please enter payment details"]
    }
})

const tenent = mongoose.model('user_master',tenentSchema);
module.exports = tenent