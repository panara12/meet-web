const seller_session_checker =(req,res,next)=>{
    if(!req.session || !req.session.user){
        res.status(401).json({messsage:"User session is expired please login again"})
    }
    if(req.session.user.user_role !="Seller"){
        res.status(401).json({messsage:"User not authorized"})
    }
    next()
}

module.exports = seller_session_checker