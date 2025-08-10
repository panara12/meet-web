const Tenent = require('../models/tenent_model');

const getTenentList = async()=>{
    let tenent_list = await Tenent.find();
    return tenent_list;
}

module.exports = getTenentList