const express = require('express')
const bcrypt = require('bcrypt');
const user_session_checker = require('../middleware/user_session');
const router = express.Router()
const manualLog = require('../utils/manuallogger');

router.post('/addsubadmin',user_session_checker("add_subadmin"),async(req,res)=>{
    manualLog('entered in add new subadmin route')
    try {
        const {name,username,password}  = req.body;
        //hash round and convert normal password to hasspassword
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const SubadminModel = req.db.model("Subadmin");

        const new_subadmin = new SubadminModel({
            name:name,
            username:username,
            password:hashedPassword
        })
        await new_subadmin.save();
        manualLog(`subadmin registred successfully :: ${new_subadmin._id}`)
        res.status(200).json({
            message:"new subadmin added",
            subadmin:{new_subadmin}
        })
    } catch (error) {
        if(error.name == 'ValidationError'){
            const validationErrors = Object.values(error.errors).map(err => err.message);
            console.log(error)
            manualLog(`there is a validation error in subadmin registration :: ${error}`)
            res.status(400).json({message:"something broke",error:validationErrors})
        }else{
        console.log('failed to add new subadmin')
        manualLog(`failed to add new subadmin :: ${error}`)
        res.status(500).json({message:"internal server error",error:error})
        }
    }
})

router.post('/editsubadmin/:subadminId',user_session_checker("edit_subadmin"),async(req,res)=>{
    manualLog('entered in edit subadmin route')
    try {
        const {subadminId} = req.params;
        const {name,username,password}  = req.body;
        const SubadminModel = req.db.model("Subadmin");
        const updateData = {
            name:name,
            username:username
        };
        if(password){
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            updateData.password = hashedPassword;
        }
        const updatedSubadmin = await SubadminModel.findByIdAndUpdate(subadminId,updateData,{new:true});
        manualLog(`subadmin updated successfully :: ${updatedSubadmin._id}`)
        res.status(200).json({
            message:"subadmin updated",
            subadmin:updatedSubadmin
        })
    } catch (error) {
        console.log('failed to update subadmin')
        manualLog(`failed to update subadmin :: ${error}`)
        res.status(500).json({message:"internal server error",error:error})
    }
})

router.get('/listsubadmin',user_session_checker("view_subadmin"),async(req,res)=>{
    manualLog('entered in list subadmin route')
    try {
        const SubadminModel = req.db.model("Subadmin");
        const subadmins = await SubadminModel.find({}, {password:0});
        manualLog(`subadmin list fetched successfully :: ${subadmins.length}`)
        res.status(200).json({
            message:"subadmin list fetched",
            subadmins:subadmins
        })
    } catch (error) {
        console.log('failed to fetch subadmin list')
        manualLog(`failed to fetch subadmin list :: ${error}`)
        res.status(500).json({message:"internal server error",error:error})
    }
})

router.delete('/deletesubadmin/:subadminId',user_session_checker("delete_subadmin"),async(req,res)=>{
    manualLog('entered in delete subadmin route')
    try {
        const {subadminId} = req.params;
        const SubadminModel = req.db.model("Subadmin");
        await SubadminModel.findByIdAndDelete(subadminId);
        manualLog(`subadmin deleted successfully :: ${subadminId}`)
        res.status(200).json({
            message:"subadmin deleted"
        })
    } catch (error) {
        console.log('failed to delete subadmin')
        manualLog(`failed to delete subadmin :: ${error}`)
        res.status(500).json({message:"internal server error",error:error})
    }
})

router.post('/subadminlogin',async(req,res)=>{
    manualLog('entered in subadmin login route')
    try {
        const {username,password}  = req.body;
        const SubadminModel = req.db.model("Subadmin");
        const subadmin = await SubadminModel.findOne({username:username});
        if(!subadmin){
            manualLog(`subadmin login failed :: username not found ${username}`)
            return res.status(401).json({message:"invalid credentials"})
        }
        const isPasswordValid = await bcrypt.compare(password, subadmin.password);
        if(!isPasswordValid){
            manualLog(`subadmin login failed :: password invalid for username ${username}`)
            return res.status(401).json({message:"invalid credentials"})
        }
        manualLog(`subadmin logged in successfully :: ${subadmin._id}`)
        const updatedSubadmin = await SubadminModel.findByIdAndUpdate(subadmin._id, {...subadmin, log_history:{...log_history, login_time: new Date()} }, { new: true });
        res.status(200).json({
            message:"login successful",
            subadmin:updatedSubadmin
        })
    } catch (error) {
        console.log('failed to login subadmin')
        manualLog(`failed to login subadmin :: ${error}`)
        res.status(500).json({message:"internal server error",error:error})
    }
})

module.exports = router;