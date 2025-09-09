const express = require('express');
const Store_location = require('../utils/Store_location');

const router = express.Router()

router.post('/locationEntry',async(req,res)=>{
    try {
        const user_id = req.session.user.user_id;
        const tenent_name = req.session.user.tenant;

        const store_location = await Store_location(req.body,user_id,tenent_name);
        if(!store_location){
            res.status(500).json({
                message:"error in location store"
            })
        }
        res.status(200).json({
            message:"location stored",
            location:store_location
        })
    } catch (error) {
        console.log("error in location entry");
        res.status(500).json({
            message:"there is error in location entry"
        })
    }
})

module.exports = router