const express = require('express')
const Salesman = require('../models/salesman_model');
const bcrypt = require('bcrypt');
const router = express.Router()
const tenent_checker = require('../middleware/tenent_middleware');

router.use(tenent_checker);

router.post('/addsalesman',async(req,res)=>{
    try {
        const {salesman_name,salesman_email,salesman_password,salesman_mobile,salesman_address,salesman_order_count,salesman_username,user_role} = req.body
        //hash round and convert normal password to hasspassword
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(salesman_password, saltRounds);
        const Salesman = req.db.model("Salesman");

        const new_selesman = new Salesman({salesman_name,salesman_email,salesman_password:hashedPassword,salesman_mobile,salesman_address,salesman_order_count,salesman_username,user_role})
        await new_selesman.save();
        res.status(200).json({
            message:"new salesman added",
            salesman:{new_selesman}
        })
    } catch (error) {
        if(error.name == 'ValidationError'){
            console.log(error)
            const error_message = Object.values(error.errors).map(err => err.message);
            res.status(400).json({message:error_message})
        }else{
        console.log('failed to add new salesman')
        res.status(500).json({message:"new salesman not added"})  
        }  
    }
})

router.post('/updatesalesman/:id',async(req,res)=>{
    try {
        const {id} = req.params;
        const user_data = req.body;
        const Salesman = req.db.model("Salesman");
        const updated_salesman = await Salesman.findOneAndUpdate({_id:id},{$set:user_data},{new:true})
        res.status(200).json({
            message:"updated salesman added",
            salesman:{updated_salesman}
        })
    } catch (error) {
        if(error.name == 'ValidationError'){
            console.log(error)
            const error_message = Object.values(error.errors).map(err => err.message);
            res.status(400).json({message:error_message})
        }else{
            console.log('failed to update tyhe selesman')
            res.status(500).json({message:"failed to update salesman information"})    
        }
    }
})


router.get('/getallsalesman',async(req,res)=>{
    try {
        const Salesman = req.db.model("Salesman");
        const salesman_data = await Salesman.find();
        res.status(200).json({
            message:"got all the salesman",
            salesman:{salesman_data}
        })
    } catch (error) {
        console.log("salesman data not fetched");
        res.status(500).json({message:"salesman data is not fetched"})
    }
})

router.get('/getsalesman/:id',async(req,res)=>{
    try {
        const {id} = req.params;
        const Salesman = req.db.model("Salesman");
        const salesman_data = await Salesman.findOne({_id:id});
        res.status(200).json({
            message:"",
            salesman:{salesman_data}
        })
    } catch (error) {
        console.log("salesman not found");
        res.status(500).json({message:"salesman data is not found"})
    }
})


router.delete('/deletesalesman/:id',async(req,res)=>{
    try {
        const {id} = req.params;
        const Salesman = req.db.model("Salesman");
        const salesman_data = await Salesman.findOneAndDelete({_id:id});
        res.status(200).json({
            message:"salesman deleted",
            salesman:{salesman_data}
        })
    } catch (error) {
        console.log("salesman data not deleted");
        res.status(500).json({message:"salesman data is not deleted"})
    }
})
module.exports = router