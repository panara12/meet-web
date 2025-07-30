const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const tenent_checker = require('../middleware/tenent_middleware');

router.use(tenent_checker);

//seller login
router.post('/sellerlogin',async(req,res)=>{
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
            req.session.user_id = user_data._id;
            req.session.user_role = user_data.user_role;
            // console.log("session data"+req.session.user_id)
            res.status(200).json({
                message:"user login seccusfull",
                user_data:{user_id:user_data._id}
            });
        }else{
            res.send('username and password does not match');
        }
    }
 })

//distributer login
router.post('/distributerlogin',async(req,res)=>{
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
            req.session.user_id = user_data._id
            req.session.user_role = user_data.user_role;
            console.log("session data"+req.session.user_role)
            res.status(200).json({
                message:"user login seccusfull",
                user_data:{user_id:user_data._id}
            });
        }else{
            res.send('username and password does not match');
        }
    }
})

//salesman login
router.post('/salesmanlogin',async(req,res)=>{
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
            req.session.user_id = user_data._id
            req.session.user_role = user_data.user_role;
            console.log("session data"+req.session.user_role)
            res.status(200).json({
                message:"user login seccusfull",
                user_data:{user_id:user_data._id}
            });
        }else{
            res.send('username and password does not match');
        }
    }
})


router.get('/distributerlogout',(req,res)=>{
    try {

        req.session.destroy(err => {
        if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ message: "Logout failed" });
        }

        res.clearCookie("connect.sid"); // Clears the session cookie from browser
        res.status(200).json({ message: "Logged out successfully" });
    });

    } catch (error) {
        console.log("error in distributer logout");
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

        res.clearCookie("connect.sid"); // Clears the session cookie from browser
        res.status(200).json({ message: "Logged out successfully" });
    });

    } catch (error) {
        console.log("error in distributer logout");
        res.status(500).json({message:"error in distributer logout"})
    }
})
router.get('/salesmanlogout',(req,res)=>{
    try {

        req.session.destroy(err => {
        if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ message: "Logout failed" });
        }

        res.clearCookie("connect.sid"); // Clears the session cookie from browser
        res.status(200).json({ message: "Logged out successfully" });
    });

    } catch (error) {
        console.log("error in distributer logout");
        res.status(500).json({message:"error in distributer logout"})
    }
})
module.exports = router