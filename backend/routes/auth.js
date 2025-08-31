const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const Tenent_user_master = require('../models/tenent_user_model');
const { generateCookieName, attachCustomCookie} = require('../middleware/session_middleware')
const manualLog = require('../utils/manuallogger');

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
            user_id: user_data._id,
            user_role: user_data.user_role,
            username,
            tenant: user_data.user_tenant
        };

        manualLog(`user logged in successfully: ${username}`);
            setTimeout(()=>{
                res.status(200).send({
                success:true,
                message:'user logged in successfully',
                user: req.session.user
                });
            },4000);
        

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
    try {
        req.session.destroy(err => {
            if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).send({ 
                    success:false,
                    message: "Logout failed" 
                });
            }

            const { username, user_role, tenant } = req.session.user;
            const cookieName = generateCookieName(tenant, user_role, username);
            res.clearCookie(cookieName);
            res.status(200).send({ 
                success:false,
                message: "Logged out successfully" 
            });
        });
        manualLog('salesman logged out');
    } catch (error) {
        console.log("error in salesman logout");
        manualLog(`error in salesman logout :: ${JSON.stringify(error)}`)
        res.status(500).send({message:"error in salesman logout"})
    }
})
module.exports = router