const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const tenent_checker = require('../middleware/tenent_middleware');
const { generateCookieName, attachCustomCookie} = require('../middleware/session_middleware')
const manualLog = require('../utils/manuallogger');

router.use(tenent_checker)

//comman login 

router.post('/login',async(req,res)=>{
    manualLog(`entered in login`)
    try {
        const {username,password,user_role} = req.body
        const Tenent_user_master = req.db.model("Tenent_user_master");
        const user_data = await Tenent_user_master.findOne({
            $or: [
                { user_email: username },
                { user_username: username }
            ]
        });

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

        const cookieName = generateCookieName(req.tenent.D_domain, user_data.user_role, username);
        const result = attachCustomCookie(req, cookieName);
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
            tenant: req.tenent.D_domain
        };

        manualLog(`user logged in successfully: ${username}`);
            setTimeout(()=>{
                res.status(200).send({
                success:true,
                message:'user logged in successfully',
                user: user_data
                });
            },4000);
        

    } catch (error) {
        manualLog(`Error in user login: ${JSON.stringify(error)}`);
        res.status(500).send({ message: "Error in user login" });
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