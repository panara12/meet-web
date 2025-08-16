const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const tenent_checker = require('../middleware/tenent_middleware');
const { generateCookieName, attachCustomCookie} = require('../middleware/session_middleware')
const manualLog = require('../utils/manuallogger');
const Store_location = require("../utils/Store_location");

router.use(tenent_checker);

//seller login
router.post('/sellerlogin',async(req,res)=>{
    manualLog(`entered in seller login route`)
    try {
        const {username,password} = req.body
        const Seller = req.db.model("Seller");
        const user_data = await Seller.findOne({
            $or: [
                { seller_email: username },
                { seller_username: username }
            ]
        });
        
        if(user_data == null){
            res.send("user not Found");
        }

        const isMatch = await bcrypt.compare(password, user_data.seller_password);
        if (!isMatch) {
            return res.status(401).send('Username or password does not match');
        }

        // Step 1: Generate cookie name
        const cookieName = generateCookieName(req.tenent.D_domain, user_data.user_role, username);
        const result = attachCustomCookie(req, cookieName);
        if(!result){
            console.log('cookie is not setted')
            res.status(500).send({message:"error in setting session"})
        }

        req.session.user = {
            user_id: user_data._id,
            user_role: user_data.user_role,
            username,
            tenant: req.tenent.D_domain
        };
        res.status(200).send({
            message:'seller logged in succesfully',
            user:req.session.user.username
        })

    } catch (error) {
        manualLog(`there is error in seller login :: ${error}`)
        console.log('there is an error in seller loggin')
        res.status(500).json({message:"there is error in seller login"})
    }
 })

//distributer login
router.post('/distributerlogin',async(req,res)=>{
    manualLog(`entered in distributer login`)
    // console.log(req.tenent);
    try {
        const {username,password} = req.body
        const Distributer = req.db.model("Distributer");
        // console.log("get data from req and model")
        const user_data = await Distributer.findOne({
            $or: [
                { distributer_email: username },
                { distributer_username: username }
            ]
        });
        // console.log("get user from db",user_data)

        if(user_data == null){
            res.send("user not Found");
        }

        const isMatch = await bcrypt.compare(password, user_data.distributer_password);
        if (!isMatch) {
            return res.status(401).send('Username or password does not match');
        }
        // console.log('password matched and go fro the cookie name')
        // Step 1: Generate cookie name
        const cookieName = generateCookieName(req.tenent.D_domain, user_data.user_role, username);
        const result = attachCustomCookie(req, cookieName);
        if(!result){
            console.log('cookie is not setted')
            res.status(500).send({message:"error in setting session"})
        }

        req.session.user = {
            user_id: user_data._id,
            user_role: user_data.user_role,
            username,
            tenant: req.tenent.D_domain
        };
        res.status(200).send({
            message:'distributer logged in succesfully',
            user:req.session.user.username
        })

    } catch (error) {
        console.log("there is error in distributer login")
        manualLog(`there is error in distributer login :: ${JSON.stringify(error)}`)
        res.status(500).send({message:"there is error in distributer login"})
    }
})

//salesman login
router.post('/salesmanlogin',async(req,res)=>{
    manualLog(`entered in salesman login`)
    try {
        const {username,password} = req.body
        const Salesman = req.db.model("Salesman");
        const user_data = await Salesman.findOne({
            $or: [
                { salesman_email: username },
                { salesman_username: username }
            ]
        });
        
        if(user_data == null){
            res.send("user not Found");
        }
        const isMatch = await bcrypt.compare(password, user_data.salesman_password);
        if (!isMatch) {
            return res.status(401).send('Username or password does not match');
        }
        const cookieName = generateCookieName(req.tenent.D_domain, user_data.user_role, username);
        const result = attachCustomCookie(req, cookieName);
        if(!result){
            console.log('cookie is not setted')
            res.status(500).send({message:"error in setting session"})
        }

        req.session.user = {
            user_id: user_data._id,
            user_role: user_data.user_role,
            username,
            tenant: req.tenent.D_domain
        };

        const user_location_stored = await Store_location(req,user_data._id,req.tenent.D_domain);
        if(!user_location_stored){
            res.status(200).send({
                message:'salesman logged in succesfully but not with location',
                user:req.session
            })
        }
        res.status(200).send({
            message:'salesman logged in succesfully with location ',
            user:req.session
        })

    } catch (error) {
        console.log("there is error in distributer login")
        manualLog(`there is error in distributer login :: ${JSON.stringify(error)}`)
        res.status(500).send({message:"there is error in distributer login"})
    }
})


router.get('/distributerlogout',(req,res)=>{
    try {

        req.session.destroy(err => {
            if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).json({ message: "Logout failed" });
            }

            res.clearCookie(`sid_${req.tenent.D_dbname}`); // Clears the session cookie from browser
            res.status(200).json({ message: "Logged out successfully" });
        });
        manualLog('distributer logged out')

    } catch (error) {
        console.log("error in distributer logout");
        manualLog(`error in distributer logout :: ${JSON.stringify(error)}`)
        res.status(500).json({message:"error in distributer logout"})
    }
})

router.get('/sellerlogout',(req,res)=>{
    try {
        req.session.destroy(err => {
            if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).json({ message: "Logout failed" });
            }

            res.clearCookie(`sid_${req.tenent.D_dbname}`); // Clears the session cookie from browser
            res.status(200).json({ message: "Logged out successfully" });
        });
        manualLog('seller logged out')

    } catch (error) {
        console.log("error in seller logout");
        manualLog(`error in seller logout :: ${JSON.stringify(error)}`)
        res.status(500).json({message:"error in seller logout"})
    }
})
router.get('/salesmanlogout',(req,res)=>{
    try {

        req.session.destroy(err => {
            if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).json({ message: "Logout failed" });
            }

            res.clearCookie(`sid_${req.tenent.D_dbname}`); // Clears the session cookie from browser
            res.status(200).json({ message: "Logged out successfully" });
        });
        manualLog('salesman logged out');
    } catch (error) {
        console.log("error in salesman logout");
        manualLog(`error in salesman logout :: ${JSON.stringify(error)}`)
        res.status(500).json({message:"error in salesman logout"})
    }
})
module.exports = router