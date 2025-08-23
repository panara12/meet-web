const express = require('express');
const bcrypt = require('bcrypt');
const distributer_session_checker = require('../middleware/distributer_session');
const router = express.Router();
const tenent_checker = require('../middleware/tenent_middleware');
const manualLog = require('../utils/manuallogger');

router.use(tenent_checker);

router.post('/adddistributer',async (req,res)=>{
    manualLog('entered distributer registration route')
    try {
    const {distributer_name,distributer_mobile,distributer_email,distributer_password,distributer_firms,distributer_city,distributer_username,distributer_plan,user_role} = req.body
    console.log(req.body)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(distributer_password, saltRounds);
    const Distributer = req.db.model("Distributer");
    const Tenent_user_master = req.db.model("Tenent_user_master");
    const new_user = new Distributer({distributer_name,distributer_mobile,distributer_email,distributer_firms,distributer_city,distributer_username,distributer_plan,user_role});
    await new_user.save();
    await Tenent_user_master.create({user_email:distributer_email,user_password:hashedPassword,user_role:"distributer"});
    manualLog(`new distributer added :: ${new_user._id}`)

    res.status(200).json({
        message:"user registerd",
        Distributer:{new_user}
    })
    } catch (error) {
         if(error.name == 'ValidationError'){
            console.log(error)
            const error_message = Object.values(error.errors).map(err => err.message);
            manualLog(`entered in distributer validation error :: ${error_message}`);
            res.status(400).json({message:error_message})
        }else{
            console.log("resistration error");
            manualLog(`there is an error in new distributer adding error :: ${JSON.stringify(error)}`);
            res.status(500).json({message:'regisstration error'})  
        }
    }

})


router.get('/distributerdata/:id',async(req,res)=>{
    manualLog('entered in get distributer by id')
    try {
        const {id} = req.params
        const Distributer = req.db.model("Distributer");
        const user_data = await Distributer.findOne({_id:id});
        console.log(user_data);
        manualLog(`distributer get by id ::${user_data._id}`)
        res.status(200).json({
            message:"got the user data",
            Distributer:{user_data}
        })
    } catch (error) {
        console.log("user data not getting error");
        manualLog(`there is error in getting distributer by id :: ${JSON.stringify(error)}`)
        res.status(500).json({message:'somehow user does not get'})  
    }
})

router.post('/distributerupdate/:id',distributer_session_checker,async(req,res)=>{
    manualLog(`entered in distributer update route`)
    try {
        const {id} = req.params;
        const user_data = req.body;
        const Distributer = req.db.model("Distributer");
        const updated_data =  await Distributer.findOneAndUpdate({_id:id},{$set: user_data},{new:true});
        manualLog(`distributer updated :: ${updated_data._id}`)
        res.status(200).json({
            message:"the user has been udated",
            Distributer:{updated_data}
        })
    } catch (error) {
        console.log("user data is not updated");
        manualLog(`there is error in updating distributer :: ${JSON.stringify(error)}`)
        res.status(500).json({message:'data is not updated'})
    }
})


module.exports = router;