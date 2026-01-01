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
    routeLocationlimit:{
        type: Number,
        default: 20
    }
})

module.exports = limitsSchema;