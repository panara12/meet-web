const distributer_session_checker =(req,res,next)=>{
    // console.log(req.session.user);
    if(!req.session || !req.session.user){
        res.status(401).json({messsage:"User session is expired please login again"})
    }
    if(req.session.user.user_role !="distributer"){
        res.status(401).json({messsage:"User not authorized"})
    }
    next();
}

module.exports = distributer_session_checker