const express = require('express');
const Tenent = require('../models/tenent_model');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/addtenent',async (req,res)=>{
    try {
    const {D_name,D_domain,D_plan,D_payment,D_dbname} = req.body
    console.log(req.body)
    // const saltRounds = 10;
    // const hashedPassword = await bcrypt.hash(distributer_passoword, saltRounds);
    
    const new_user = new Tenent({D_name,D_domain,D_plan,D_payment,D_dbname});
    await new_user.save();

    res.status(200).json({
        message:"Tenent registerd",
        Tenent:{new_user}
    })
    } catch (error) {
         if(error.name == 'ValidationError'){
            console.log(error)
            const error_message = Object.values(error.errors).map(err => err.message);
            res.status(400).json({message:error_message})
        }else{
            console.log("Tenent resistration error");
            res.status(500).json({message:'Tenent regisstration error'})  
        }
    }

})


router.get('/tenentdata/:id',async(req,res)=>{
    try {
        const {id} = req.params
        const user_data = await Tenent.findOne({_id:id});
        console.log(user_data);
        res.status(200).json({
            message:"got the Tenent data",
            Tenent:{user_data}
        })
    } catch (error) {
        console.log("Tenent data not getting error");
        res.status(500).json({message:'somehow Tenent does not get'})  
    }
})

router.post('/tenentupdate/:id',async(req,res)=>{
    try {
        const {id} = req.params;
        const user_data = req.body;
        const updated_data =  await Tenent.findOneAndUpdate({_id:id},{$set: user_data},{new:true});
        res.status(200).json({
            message:"the Tenent has been udated",
            Tenent:{updated_data}
        })
    } catch (error) {
        console.log("Tenent data is not updated");
        res.status(500).json({message:'Tenent data is not updated'})
    }
})


module.exports = router;