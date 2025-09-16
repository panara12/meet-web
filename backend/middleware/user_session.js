const permissions = require('../utils/permissions')
const user_session_checker =(permission)=>{
    return (req,res,next)=>{
    // console.log(req.session.user);
    console.log("get in user middile weae")
    if(!req.session || !req.session.user){
        res.status(401).json({messsage:"User session is expired please login again"})
    }
    // Suppose this is inside a route handler
    const user_role = req.session.user.user_role.toLowerCase();  // e.g. "Distributer"
    const permissionToCheck = permission;      // the permission you want to check
    console.log("permission",permissions[user_role]?.includes(permissionToCheck))
    console.log("permission nw ",permissionToCheck,user_role)
    const hasPermission = permissions[user_role]?.includes(permissionToCheck);

    if(!hasPermission){
        res.status(403).json({messsage:"permission denied,contact to admin"});
    }
    else if(hasPermission) next();
}
}

module.exports = user_session_checker