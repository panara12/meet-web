const mongoose = require('mongoose');
const limitsSchema = new mongoose.Schema({
    adminlimit: {
        type: Number,
        default: 1
    },
    salesmanlimit: {
        type: Number,
        default: 2
    },
    packagelimit:{
        type: Number,
        default: 1
    },
    billinglimit:{
        type: Number,
        default: 1
    },
    liveLocationlimit:{
        type: Number,
        default: 35
    },
    totalLiveLocationlimit:{
        type: Number,
        default: 35
    },
    routeLocationlimit:{
        type: Number,
        default: 35
    },
    totalRouteLocationlimit:{
        type: Number,
        default: 35
    },
    wantToUsePhotos:{
        type: Boolean,
        default: true
    },
    idAdminMembers:{
        type: Boolean,
        default: false
    },
    wantToUsePayment:{
        type:Boolean,
        default:true
    },
    wantToUseLocation:{
        type:Boolean,
        default:true
    },
    placedOrderCount:{
        type:Number,
        default:0
    }
})

module.exports = limitsSchema;