const mongoose = require('mongoose')

const fileSchema = mongoose.Schema({
    file_name : {
        type: String,
        required:[true,'please enter file name']
    },
    file_url : {
        type : String,
        required:[true,'please enter file url']
    },
    file_day : {
        type : String,
        required:[true,'please enter file data']
    },
    file_description : {
        type : String,
        default : null
    },
    uploaded_by : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Distributer',
    },
    uploaded_for : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    },
    uploaded_at : {
        type : Date,
        default : Date.now
    },
},{  timestamps: true  });

module.exports = fileSchema