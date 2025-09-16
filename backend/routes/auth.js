const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const Tenent_user_master = require('../models/tenent_user_model');
const { generateCookieName, attachCustomCookie} = require('../middleware/session_middleware')
const manualLog = require('../utils/manuallogger');
const resetPassword = require('../utils/resetpasswordotp');
const ResetPassword = require('../models/reset_password_model');

//comman login 

router.post('/login',async(req,res)=>{
    manualLog(`entered in login`)
    try {
        const {username,password} = req.body
        const user_data = await Tenent_user_master.findOne({
            $or: [
                { user_email: username },
                { user_username: username }
            ]
        });
        // console.log("get user data",user_data);

        if(user_data == null){
            return res.status(400).send({ 
                success:false,
                message: "User not Found" 
            });
        }

        const isMatch = await bcrypt.compare(password, user_data.user_password);
        if (!isMatch) {
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

        manualLog(`user logged in successfully: ${username}`);
  
        res.status(200).send({
        success:true,
        message:'user logged in successfully',
        user: req.session.user
        });
        

    } catch (error) {
        manualLog(`Error in user login: ${JSON.stringify(error)}`);
        res.status(500).send({ message: "Error in user login",error });
    }
})


router.get('/me',(req,res)=>{
    manualLog(`entered in get me`);
    console.log("auth me")
    try {
        if(req.session && req.session.user){
            manualLog(`got the user data`);
            res.send({
                loggedIn: true,
                user: req.session.user, // you probably stored {id, role, name}
            });
        }else{
            res.status(401).send({
                loggedIn: false,
                message: "Session expired or not logged in",
            })
        }
    } catch (error) {
        manualLog(`Error in auth me: ${JSON.stringify(error)}`);
        res.status(500).send({ message: "Error in auth me",error });
    }
})


router.get('/logout',(req,res)=>{
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
    try {
        const {email} = req.body
        const userData = await Tenent_user_master.findOne({user_email:email});
        console.log(userData)
        if(!userData){
            return res.status(400).send({
                success:false,
                message:"user not found"
            })
        }
        const result = await resetPassword(email,userData);
        return res.status(200).send(result);    
    } catch (error) {
        console.log("something went wronge in forgot password",error)
        return res.status(500).send({message:"something went wronge in forgot password",error})
    }
    
})

router.post("/checkotp",async(req,res)=>{
    try {
        const {email,otp}= req.body;
        if(email==null){
            return res.send({success:false,message:"link or otp expired, please try again"})
        }
        console.log(req.body)
        const now = Date.now();
        const userdata = await ResetPassword.findOne({user_email:email,otp_expiry:{$gt:now},user_otp:otp}).sort({ createdAt: -1 });
        console.log("userdata==",userdata)
        if (!userdata) {
            return res.send({ success: false, message: "Invalid or expired OTP" });
        } 

        userdata.is_successfull = true;
        await userdata.save();
        console.log("userdata saved")
        res.status(200).send({message:"OTP verified successfully",success:true})
        
    } catch (error) {
        console.log("there something wronge in otp verification")
        res.status(500).send({
            message:"something went wronge please try again"
        })
    }
})


router.post('/resetpassword',async(req,res)=>{
    try {
        console.log(req.body)
        const {email,password} = req.body
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log('hashed done')
        const userData = await Tenent_user_master.findOneAndUpdate({user_email:email},{user_password:hashedPassword},{new:true});
        console.log(userData)
        if(!userData){
            return res.status(400).send({
                success:false,
                message:"user not found"
            })
        }
        console.log('password updated')
        return res.status(200).send({success:true,message:"password updated successfully",data:userData});    
    } catch (error) {
        console.log("something went wronge in reset password",error)
        return res.status(500).send({message:"something went wronge in reset password",error})
    }
    
})

module.exports = router