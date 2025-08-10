const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const tenent_checker = require('../middleware/tenent_middleware');
const session_setter = require('../middleware/session_middleware')
const manualLog = require('../utils/manuallogger');

router.use(tenent_checker);

//seller login
router.post('/sellerlogin',session_setter,async(req,res)=>{
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
        }else{
            const isMatch = await bcrypt.compare(password, user_data.seller_password);
            if(isMatch){
                req.session.user = {
                    user_id : user_data._id,
                    user_role : user_data.user_role,
                    username : user_data.username,
                    tenent_domain : req.tenent.D_domain
                }
                // console.log("session data"+req.session.user_id)
                manualLog(`seller login seccesfully :: ${req.session.user.user_id}`)
                res.status(200).json({
                    message:"user login seccusfull",
                    user_data:req.session
                });
            }else{
                manualLog(`seller username  and password does not match`);
                res.send('username and password does not match');
            }
        }
    } catch (error) {
        manualLog(`there is error in seller login :: ${error}`)
        console.log('there is an error in seller loggin')
        res.status(500).json({message:"there is error in seller login"})
    }
 })

//distributer login
router.post('/distributerlogin',session_setter,async(req,res)=>{
    manualLog(`entered in distributer login`)
    // console.log(req.tenent);
    try {
        const {username,password} = req.body
        const Distributer = req.db.model("Distributer");
        const user_data = await Distributer.findOne({
            $or: [
                { distributer_email: username },
                { distributer_username: username }
            ]
        });

        if(user_data == null){
            res.send("user not Found");
        }else{
            const isMatch = await bcrypt.compare(password, user_data.distributer_password);
            if(isMatch){
                req.session.user = {
                    user_id : user_data._id,
                    user_role : user_data.user_role,
                    username : user_data.username,
                    tenent_domain : req.tenent.D_domain
                }
                console.log("session data"+req.session.user)
                manualLog(`distributer login succesfully :: ${req.session.user.user_id}`)
                res.status(200).json({
                    message:"user login seccusfull",
                    user_data:req.session
                });
            }else{
                manualLog('distributer username password not match')
                res.send('username and password does not match');
            }
        }
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
        }else{
            const isMatch = await bcrypt.compare(password, user_data.salesman_password);
            if(isMatch){
                req.session.user = {
                    user_id : user_data._id,
                    user_role : user_data.user_role,
                    username : user_data.username,
                    tenent_domain : req.tenent.D_domain
                }
                console.log("session data"+req.session.user.user_role)
                manualLog(`salesman login succesfully :: ${req.session.user.user_id}`)
                res.status(200).json({
                    message:"user login seccusfull",
                    user_data:req.session
                });
            }else{
                manualLog(`salesman username and password not found`);
                res.send('username and password does not match');
            }
        }
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