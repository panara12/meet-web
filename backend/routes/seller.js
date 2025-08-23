const express = require('express')
const Seller = require('../models/seller_model');
const bcrypt = require('bcrypt');
const seller_session_checker = require('../middleware/seller_session');
const distributer_session_checker = require('../middleware/distributer_session')
const router = express.Router()
const tenent_checker = require('../middleware/tenent_middleware');
const manualLog = require('../utils/manuallogger');

router.use(tenent_checker);

router.post('/addseller',async(req,res)=>{
    manualLog('entered in add new seller route')
    try {
        const {seller_name,seller_email,seller_password,seller_mobile,seller_address,seller_area,seller_city,seller_username,user_role} = req.body
        //hash round and convert normal password to hasspassword
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(seller_password, saltRounds);
        const Seller = req.db.model("Seller");
        const Tenent_user_master = req.db.model("Tenent_user_master");

        const new_seller = new Seller({seller_name,seller_email,seller_password:hashedPassword,seller_mobile,seller_address,seller_area,seller_city,seller_username,user_role})
        await new_seller.save();
        await Tenent_user_master.create({user_email:seller_email,user_password:hashedPassword,user_role:"seller"});
        manualLog(`seller registred successfully :: ${new_seller._id}`)
        res.status(200).json({
            message:"new seller added",
            seller:{new_seller}
        })
    } catch (error) {
        if(error.name == 'ValidationError'){
            console.log(error)
            const error_message = Object.values(error.errors).map(err => err.message);
            manualLog(`there is a validation error in seller registration :: ${err.message}`)
            res.status(400).json({message:error_message})
        }else{
        console.log('failed to add new seller')
        manualLog(`there is error in seller registration :: ${JSON.stringify(error)}`)
        res.status(500).json({message:"new seller not added"})  
        }  
    }
})

router.post('/updateseller/:id',async(req,res)=>{
    manualLog('entered in update seller route')
    try {
        const {id} = req.params;
        const user_data = req.body;
        const Seller = req.db.model("Seller");
        const updated_seller = await Seller.findOneAndUpdate({_id:id},{$set:user_data},{new:true})
        manualLog(`seller updated successfully :: ${updated_seller._id}`)
        res.status(200).json({
            message:"seller updated",
            seller:{updated_seller}
        })
    } catch (error) {
        if(error.name == 'ValidationError'){
            console.log(error)
            const error_message = Object.values(error.errors).map(err => err.message);
            manualLog(`there is a validation error in seller update :: ${err.message}`)
            res.status(400).json({message:error_message})
        }else{
            console.log('failed to update seller')
            manualLog(`there is error in update seller :: ${JSON.stringify(error)}`)
            res.status(500).json({message:"seller not updated"})    
        }
    }
})

router.get('/allseller',distributer_session_checker,async(req,res)=>{
    manualLog('entered in get all seller route')
    try {
        const Seller = req.db.model("Seller");
        const seller_data = await Seller.find();
        manualLog(`get all seller  successfully`)
        res.status(200).json({
            message:"got all the sellers",
            seller:{seller_data}
        })
    } catch (error) {
        console.log("seller data not fetched");
        manualLog(`there is error in get all seller :: ${JSON.stringify(error)}`)
        res.status(500).json({message:"seller data is not fetched"})
    }
})

router.get('/getseller/:id',seller_session_checker,async(req,res)=>{
    manualLog('entered in get seller by id route')
    try {
        const {id} = req.params;
        const Seller = req.db.model("Seller");
        const seller_data = await Seller.findOne({_id:id});
        manualLog(`get seller by id successfully :: ${seller_data._id}`)
        res.status(200).json({
            message:"",
            seller:{seller_data}
        })
    } catch (error) {
        console.log("seller data not found");
        manualLog(`there is error in get seller by id :: ${JSON.stringify(error)}`)
        res.status(500).json({message:"seller data is not found"})
    }
})

router.delete('/deleteseller/:id',distributer_session_checker,async(req,res)=>{
    manualLog('entered in delete seller route')
    try {
        const {id} = req.params;
        const Seller = req.db.model("Seller");
        const seller_data = await Seller.findOneAndDelete({_id:id});
        manualLog(`seller deleted successfully :: ${seller_data._id}`)
        res.status(200).json({
            message:"seller deleted",
            seller:{seller_data}
        })
    } catch (error) {
        console.log("seller data not deleted");
        manualLog(`there is error in delete seller by id :: ${JSON.stringify(error)}`)
        res.status(500).json({message:"seller data is not deleted"})
    }
})
module.exports = router