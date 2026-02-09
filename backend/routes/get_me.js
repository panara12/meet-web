const express = require('express');
const user_session_checker = require('../middleware/user_session');
const router = express.Router()
const manualLog = require('../utils/manuallogger');

router.get('/me',user_session_checker("get_limits"),async(req,res)=>{
    manualLog(`entered in get me`);
    console.log("auth me",req.session)
    const Limits = req.db.model("Limits");
    const limits = await Limits.find();
    try {
        if(req.session && req.session.user){
            manualLog(`got the user data`);
            res.send({
                loggedIn: true,
                user: req.session.user, // you probably stored {id, role, name}
                limits:limits //all the limits
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

module.exports = router