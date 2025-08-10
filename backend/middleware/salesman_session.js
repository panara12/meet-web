const salesman_session_checker =(req,res,next)=>{
    const domain = req.headers['x-tenent-domain']||'abcmarketing' || req.headers.host.split(":")[0];
    if(req.session && req.session.user.user_id  && req.session.user.tenent_domain == domain){
        if(req.session.user.user_role =="salesman"){
            next()
        }else{
            res.status(401).json({messsage:"User not authorized"})
        }
    }else{
        res.status(401).json({messsage:"User session is expired please login again"})
    }
}

module.exports = salesman_session_checker