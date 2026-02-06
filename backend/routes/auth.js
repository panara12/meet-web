const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const Tenent_user_master = require('../models/tenent_user_model');
const { generateCookieName, attachCustomCookie} = require('../middleware/session_middleware')
const manualLog = require('../utils/manuallogger');
const resetPassword = require('../utils/resetpasswordotp');
const ResetPassword = require('../models/reset_password_model');
const user_session_checker = require('../middleware/user_session');

//comman login 

router.post('/login',async(req,res)=>{
    manualLog(`entered in login`)
    try {
        const {dept,type,username,password} = req.body
        console.log("tyeo",type)
        let user_data = {}
        if(type == "Username"){
            user_data = await Tenent_user_master.findOne({ user_username: username, user_role: dept})
            console.log("username worke", user_data)
        }else if(type == "Mobile"){
            user_data = await Tenent_user_master.findOne({ user_mobile: username, user_role: dept })
            console.log("mobile", user_data,username)
        }else{
            user_data = await Tenent_user_master.findOne({ user_email: username, user_role: dept })
            console.log("email", user_data)
        }

        // const user_data = await Tenent_user_master.findOne({
        //     $or: [
        //         { user_email: username },
        //         { user_username: username },
        //         { user_mobile: username}
        //     ]
        // });
        console.log("get user data",user_data);
        manualLog('get user data',user_data);

        if(user_data == null){
            manualLog("user not found for",dept,type,username,password)
            return res.status(400).send({ 
                success:false,
                message: "User not Found" 
            });
        }

        const isMatch = await bcrypt.compare(password, user_data.user_password);
        if (!isMatch) {
            manualLog("password does not mathch")
            return res.status(400).send({ 
                message: 'Username or password does not match',
                success:false,
            });
        }

        const cookieName = await generateCookieName(user_data.user_role, username);
        const result = await attachCustomCookie(req, cookieName);
        // console.log("cookie setetd",result);
        if(!result){
            return res.status(500).send({
                message:"error in setting session",
                success:false,
            });
        }

        req.session.user = {
            master_user_id: user_data._id,
            user_role: user_data.user_role,
            username,
            tenant_user_id:user_data.tenant_user_id,
            tenant: user_data.user_tenant
        };

        manualLog(`user logged in successfully: ${req.session.user}`);
  
        res.status(200).send({
        success:true,
        message:'user logged in successfully',
        user: req.session.user
        });
        

    } catch (error) {
        manualLog(`Error in user login: ${error}`);
        res.status(500).send({ message: "Error in user login",error });
    }
})



router.get('/logout',(req,res)=>{
    manualLog("entered in logout")
    const userInfo = req.session.user;
    try {
        req.session.destroy(err => {
            if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).send({ 
                    success:true,
                    message: "Logout failed" 
                });
            }
            const { username, user_role } = userInfo;
            const cookieName = generateCookieName( user_role, username);
            res.clearCookie(cookieName);
            res.status(200).send({ 
                success:false,
                message: "Logged out successfully" 
            });
        });
        manualLog(' logged out');
    } catch (error) {
        console.log("error in salesman logout");
        manualLog(`error in salesman logout :: ${JSON.stringify(error)}`)
        res.status(500).send({message:"error in salesman logout"})
    }
})

router.post('/forgotpassword',async(req,res)=>{
    manualLog("entered in forgot password")
    try {
        const {email} = req.body
        const userData = await Tenent_user_master.findOne({user_email:email});
        console.log(userData)
        manualLog("user entered email",email)
        if(!userData){
            manualLog("user not found for email",email)
            return res.status(400).send({
                success:false,
                message:"user not found"
            })
        }
        const result = await resetPassword(email,userData);
        manualLog("otp sent successfully",result)
        return res.status(200).send(result);    
    } catch (error) {
        console.log("something went wronge in forgot password",error)
        manualLog("something went wronge in forgot password",error)
        return res.status(500).send({message:"something went wronge in forgot password",error})
    }
    
})

router.post("/checkotp",async(req,res)=>{
    manualLog("enter in check otp")
    try {
        const {email,otp}= req.body;
        if(email==null){
            return res.send({success:false,message:"link or otp expired, please try again"})
        }
        console.log(req.body)
        const now = Date.now();
        const userdata = await ResetPassword.findOne(
            {$and: [
                { user_email: email },
                { user_otp: otp },
                { otp_expiry: { $gt: new Date() } }
            ]}).sort({ createdAt: -1 });
            
        console.log("userdata==",userdata)
        if (!userdata || userdata == null) {
            return res.send({ success: false, message: "Invalid or expired OTP" });
        } 

        userdata.is_successfull = true;
        await userdata.save();
        console.log("userdata saved")
        manualLog("otp verificed successfully");
        res.status(200).send({message:"OTP verified successfully",success:true})
        
    } catch (error) {
        console.log("there something wronge in otp verification",error)
        manualLog("there something wronge in otp verification",error)
        res.status(500).send({
            message:"something went wronge please try again"
        })
    }
})


router.post('/resetpassword',async(req,res)=>{
    manualLog("enetered in reset password")
    try {
        console.log(req.body)
        const {email,password} = req.body
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log('hashed done')
        const userData = await Tenent_user_master.findOneAndUpdate({user_email:email},{user_password:hashedPassword},{new:true});
        console.log(userData)
        if(!userData){
            manualLog("user not found for email",email)
            return res.status(400).send({
                success:false,
                message:"user not found"
            })
        }
        console.log('password updated')
        manualLog("password updated successfully for email",email)
        return res.status(200).send({success:true,message:"password updated successfully",data:userData});    
    } catch (error) {
        console.log("something went wronge in reset password",error)
        manualLog("something went wronge in reset password",error)
        return res.status(500).send({message:"something went wronge in reset password",error})
    }
    
})

module.exports = router
