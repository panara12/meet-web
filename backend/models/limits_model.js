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
        default: 20
    },
    totalLiveLocationlimit:{
        type: Number,
        default: 35
    },
    routeLocationlimit:{
        type: Number,
        default: 20
    },
    totalRouteLocationlimit:{
        type: Number,
        default: 35
    }
})

module.exports = limitsSchema;