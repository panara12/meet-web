const express = require('express')
const Salesman = require('../models/salesman_model');
const bcrypt = require('bcrypt');
const router = express.Router()
const tenent_checker = require('../middleware/tenent_middleware');
const manualLog = require('../utils/manuallogger');
const Tenent_user_master = require("../models/tenent_user_model");
const distributer_session_checker = require('../middleware/distributer_session');
const doc_cloudinary_upload = require('../utils/uploadWithCloudinary');
const { upload, multerErrorHandler } = require('../middleware/multer');

router.use(tenent_checker);

router.post('/addsalesman',distributer_session_checker,upload.array('images',2), multerErrorHandler,async(req,res)=>{
    manualLog('entered in add new salesman route')
    try {
        const {salesman_name,
            salesman_email,
            salesman_password,
            salesman_mobile,
            salesman_address,
            salesman_order_count,
            salesman_username,
            user_role} = req.body
        //hash round and convert normal password to hasspassword
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(salesman_password, saltRounds);

        const uploadPromises = req.files.map(file => {
            const customFileName = `${Date.now()}-${path.parse(file.originalname).name}`;
            const local_path = path.join(file.destination, file.filename);
            return doc_cloudinary_upload(local_path, tenent_username,customFileName);
        });
        const imageUrls = await Promise.all(uploadPromises);


        const Salesman = req.db.model("Salesman");

        const new_salesman = new Salesman({salesman_name,
            salesman_email,
            salesman_mobile,
            salesman_address,
            salesman_idphoto:imageUrls,
            salesman_order_count,
            salesman_username,
            user_role})
        await new_salesman.save();
        await Tenent_user_master.create({user_email:salesman_email,
            user_password:hashedPassword,
            user_username:salesman_username,
            user_tenant:req.session.user.tenant,
            user_role:"salesman"});
        manualLog(`salesman registred successfully :: ${new_salesman._id}`)
        res.status(200).json({
            message:"new salesman added",
            salesman:{new_salesman}
        })
    } catch (error) {
        if(error.name == 'ValidationError'){
            console.log(error)
            const error_message = Object.values(error.errors).map(err => err.message);
            manualLog(`there is a validation error in salesman registration :: ${err.message}`)
            res.status(400).json({message:error_message})
        }else{
        console.log('failed to add new salesman',error)
        manualLog('there is error in salesman registration')
        res.status(500).json({message:"new salesman not added",error})  
        }  
    }
})

router.post('/updatesalesman/:id',async(req,res)=>{
    manualLog('entered in update salesman route')
    try {
        const {id} = req.params;
        const user_data = req.body;
        const Salesman = req.db.model("Salesman");
        const updated_salesman = await Salesman.findOneAndUpdate({_id:id},{$set:user_data},{new:true})
        manualLog(`salesman updated successfully :: ${updated_salesman._id}`)
        res.status(200).json({
            message:"updated salesman added",
            salesman:{updated_salesman}
        })
    } catch (error) {
        if(error.name == 'ValidationError'){
            console.log(error)
            const error_message = Object.values(error.errors).map(err => err.message);
            manualLog(`there is a validation error in salesman update :: ${err.message}`)
            res.status(400).json({message:error_message})
        }else{
            console.log('failed to update tyhe selesman')
            manualLog('there is error in update salesman ')
            res.status(500).json({message:"failed to update salesman information"})    
        }
    }
})


router.get('/getallsalesman',distributer_session_checker,async(req,res)=>{
    manualLog('entered in get all salesman route')
    try {
        const Salesman = req.db.model("Salesman");
        const salesman_data = await Salesman.find();
        manualLog(`get all salesman successfully`)
        res.status(200).json({
            message:"got all the salesman",
            salesman:{salesman_data}
        })
    } catch (error) {
        console.log("salesman data not fetched");
        manualLog(`there is error in get all salesman :: ${JSON.stringify(error)}`)
        res.status(500).json({message:"salesman data is not fetched"})
    }
})

router.get('/getsalesman/:id',distributer_session_checker,async(req,res)=>{
    manualLog('entered in get salesman by id route')
    try {
        const {id} = req.params;
        const Salesman = req.db.model("Salesman");
        const salesman_data = await Salesman.findOne({_id:id});
        manualLog(`get salesman by id successfully :: ${salesman_data._id}`)
        res.status(200).json({
            message:"got salesman",
            salesman:{salesman_data}
        })
    } catch (error) {
        console.log("salesman not found");
        manualLog(`there is error in get seller by id :: ${JSON.stringify(error)}`)
        res.status(500).json({message:"salesman data is not found"})
    }
})


router.delete('/deletesalesman/:id',async(req,res)=>{
    manualLog('entered in delete salesman route')
    try {
        const {id} = req.params;
        const Salesman = req.db.model("Salesman");
        const salesman_data = await Salesman.findOneAndDelete({_id:id});
        manualLog(`salesman deleted successfully :: ${salesman_data._id}`)
        res.status(200).json({
            message:"salesman deleted",
            salesman:{salesman_data}
        })
    } catch (error) {
        console.log("salesman data not deleted");
        manualLog(`there is error in delete salesman by id :: ${JSON.stringify(error)}`)
        res.status(500).json({message:"salesman data is not deleted"})
    }
})
module.exports = router