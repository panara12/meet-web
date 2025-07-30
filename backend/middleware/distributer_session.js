const distributer_session_checker =(req,res,next)=>{
    if(req.session && req.session.user_id){
        if(req.session.user_role =="distributer"){
            next()
        }else{
            res.status(401).json({messsage:"User not authorized"})
        }
    }else{
        res.status(401).json({messsage:"User session is expired please login again"})
    }
}

module.exports = distributer_session_checker