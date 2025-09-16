const express = require('express')
const bcrypt = require('bcrypt');
const router = express.Router()
const tenent_checker = require('../middleware/tenent_middleware');
const manualLog = require('../utils/manuallogger');
const Tenent_user_master = require("../models/tenent_user_model");
const user_session_checker = require('../middleware/user_session');
const {doc_cloudinary_upload} = require('../utils/uploadWithCloudinary');
const { upload, multerErrorHandler } = require('../middleware/multer');
const path = require('path');
const cloudinary_delete = require('../utils/deleteWithCloudinary');

router.use(tenent_checker);

router.post('/adduser',user_session_checker("add_user"),upload.array('images',2), multerErrorHandler,async(req,res)=>{
    manualLog('entered in add new user route')
    try {
        console.log(req.body);
        const {user_name,
            user_email,
            user_password,
            user_mobile,
            user_address,
            user_username,
            user_role} = req.body
        const tenent_username = req.tenent.D_dbname;
        //hash round and convert normal password to hasspassword
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user_password, saltRounds);

        const uploadPromises = req.files.map(file => {
            const customFileName = `${Date.now()}-${path.parse(file.originalname).name}`;
            const local_path = path.join(file.destination, file.filename);
            return doc_cloudinary_upload(local_path, tenent_username,customFileName);
        });
        const imageUrls = await Promise.all(uploadPromises);


        const User = req.db.model("User");

        const new_user = new User({user_name,
            user_email,
            user_mobile,
            user_address,
            user_idphoto:imageUrls,
            user_username,
            user_role})
        await new_user.save();
        await Tenent_user_master.create({user_email:user_email,
            tenant_user_id:new_user._id,
            user_password:hashedPassword,
            user_username:user_username,
            user_tenant:req.session.user.tenant,
            user_role:user_role});
        manualLog(`${user_role} registred successfully :: ${new_user._id}`)
        res.status(200).json({
            message:"new user added",
            user:{new_user}
        })
    } catch (error) {
        if(error.name == 'ValidationError'){
            console.log(error)
            const error_message = Object.values(error.errors).map(err => err.message);
            manualLog(`there is a validation error in user registration :: ${err.message}`)
            res.status(400).json({message:error_message})
        }else{
        console.log('failed to add new user',error)
        manualLog('there is error in user registration')
        res.status(500).json({message:"new user not added",error})  
        }  
    }
})

router.post('/updateuser/:id',user_session_checker("edit_user"),upload.array('images',2), multerErrorHandler,async(req,res)=>{
    manualLog('entered in update user route')
    try {
        const {id} = req.params;
        const req_user_data = req.body;

        const User = req.db.model("User");
        if(req_user_data.user_idphoto){
            const user_data = await User.findById(id);
            if (!user_data) return res.status(404).json({ message: "user_data not found" });


            // Normalize product_photos from body
            const updatedPublicIds = Array.isArray(req_user_data.user_idphoto)
                ? req_user_data.user_idphoto
                : req_user_data.user_idphoto
                    ? [req_user_data.user_idphoto]
                    : [];

            // Find removed image public_ids
            const removedImgs = user_data.user_idphoto.filter(
                img => !updatedPublicIds.includes(img.public_id)
            );
            const removedPublicIds = removedImgs.map(img => img.public_id);

            // Delete them from Cloudinary in parallel
            await cloudinary_delete(removedPublicIds);

            // Retain images still present
            const retainedImages = product_data.product_photos.filter(
                img => updatedPublicIds.includes(img.public_id)
            );

            // Upload new files in parallel
            const uploadPromises = req.files.map(file => {
                const local_path = path.join(file.destination, file.filename); 
                const customFileName = `${Date.now()}-${path.parse(file.originalname).name}`;
                return doc_cloudinary_upload(local_path, tenent_username,customFileName);
            });
            const newImages = await Promise.all(uploadPromises);

            // Merge retained + new
            req_user_data.user_idphoto = [...retainedImages, ...newImages];
        }


        const updated_user = await User.findOneAndUpdate({_id:id},{$set:req_user_data},{new:true})
        manualLog(`user updated successfully :: ${updated_user._id}`)
        res.status(200).json({
            message:"updated user added",
            user:{updated_user}
        })
    } catch (error) {
        if(error.name == 'ValidationError'){
            console.log(error)
            const error_message = Object.values(error.errors).map(err => err.message);
            manualLog(`there is a validation error in user update :: ${err.message}`)
            res.status(400).json({message:error_message})
        }else{
            console.log('failed to update tyhe selesman')
            manualLog('there is error in update user ')
            res.status(500).json({message:"failed to update user information"})    
        }
    }
})


router.get('/getalluser',user_session_checker("get_all_user"),async(req,res)=>{
    manualLog('entered in get all user route')
    try {
        const User = req.db.model("User");
        const user_data = await User.find();
        manualLog(`get all user successfully`)
        res.status(200).json({
            message:"got all the user",
            user:{user_data}
        })
    } catch (error) {
        console.log("user data not fetched");
        manualLog(`there is error in get all user :: ${JSON.stringify(error)}`)
        res.status(500).json({message:"user data is not fetched"})
    }
})

router.get('/getuser/:id',user_session_checker("get_by_id_user"),async(req,res)=>{
    manualLog('entered in get user by id route')
    try {
        const {id} = req.params;
        console.log(id)
        const User = req.db.model("User");
        const user_data = await User.findOne({_id:id});
        manualLog(`get user by id successfully :: ${user_data._id}`)
        res.status(200).json({
            message:"got user",
            user:{user_data}
        })
    } catch (error) {
        console.log("user not found");
        manualLog(`there is error in get seller by id :: ${JSON.stringify(error)}`)
        res.status(500).json({message:"user data is not found"})
    }
})

router.post('/getbyuserrole',user_session_checker("user_by_userrole"),async (req,res)=>{
    manualLog('entered in  user route by user role')
    try {
        const {userRole} = req.body;
        const User = req.db.model("User");
        const user_data = await User.find({user_role:userRole});
        manualLog(`users fetched successfully :: ${user_data}`)
        if(user_data.length == 0){
            res.status(200).json({
                message:"user data not found",
                user:{user_data: "user data not found"}
            })
        }else{
            res.status(200).json({
                message:"user data fetched",
                user:{user_data}
            })
        }
    } catch (error) {
        console.log("user data not fetched by role");
        manualLog(`there is error in getting data by  user role :: ${JSON.stringify(error)}`)
        res.status(500).json({message:"user data faild to get"})
    }
})


router.delete('/deleteuser/:id',user_session_checker("delete_user"),async(req,res)=>{
    manualLog('entered in delete user route')
    try {
        const {id} = req.params;
        const User = req.db.model("User");
        const user_data = await User.findOneAndDelete({_id:id});
        manualLog(`user deleted successfully :: ${user_data._id}`)
        res.status(200).json({
            message:"user deleted",
            user:{user_data}
        })
    } catch (error) {
        console.log("user data not deleted");
        manualLog(`there is error in delete user by id :: ${JSON.stringify(error)}`)
        res.status(500).json({message:"user data is not deleted"})
    }
})
module.exports = router