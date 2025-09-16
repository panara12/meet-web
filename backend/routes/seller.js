const express = require('express')
const Seller = require('../models/seller_model');
const bcrypt = require('bcrypt');
const user_session_checker = require('../middleware/user_session');
const Tenent_user_master = require("../models/tenent_user_model");
const router = express.Router()
const tenent_checker = require('../middleware/tenent_middleware');
const manualLog = require('../utils/manuallogger');

router.use(tenent_checker);

router.post('/addseller',user_session_checker("add_seller"),async(req,res)=>{
    manualLog('entered in add new seller route')
    try {
        const {company_name,primary_email,phone_number,website,business_address,city,client_status,business_priority,payment_terms,industry,company_size,credit_limit,primary_contact_person,gst_number,business_note,user_role} = req.body
        //hash round and convert normal password to hasspassword
        const seller_password = "youdon'tknow"
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(seller_password, saltRounds);
        const Seller = req.db.model("Seller");

        const new_seller = new Seller({company_name,primary_email,phone_number,website,business_address,city,client_status,business_priority,payment_terms,industry,company_size,credit_limit,primary_contact_person,gst_number,business_note,user_role})
        await new_seller.save();
        await Tenent_user_master.create({user_email:primary_email,tenant_user_id:new_seller._id,user_password:hashedPassword,user_username:phone_number,user_tenant:req.session.user.tenant,user_role:"Seller"});
        manualLog(`seller registred successfully :: ${new_seller._id}`)
        res.status(200).json({
            message:"new seller added",
            seller:{new_seller}
        })
    } catch (error) {
        if(error.name == 'ValidationError'){
            console.log(error)
            manualLog(`there is a validation error in seller registration :: ${error}`)
            res.status(400).json({message:"sonething broke",error:error})
        }else{
        console.log('failed to add new seller')
        manualLog(`there is error in seller registration :: ${JSON.stringify(error)}`)
        res.status(500).json({message:"new seller not added"})  
        }  
    }
})

router.post('/updateseller/:id',user_session_checker("edit_seller"),async(req,res)=>{
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

router.get('/allseller',user_session_checker("get_all_seller"),async(req,res)=>{
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

router.get('/getseller/:id',user_session_checker("get_by_id_seller"),async(req,res)=>{
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

router.delete('/deleteseller/:id',user_session_checker("delete_seller"),async(req,res)=>{
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