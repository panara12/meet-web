const gettenentDb = require('../tenent');   //tenent DB getting function
const tenentCache = require('../cache/tenent_list');    //tenent list getting function
const manualLog = require('../utils/manuallogger');


const tenent_checker = async(req,res,next)=>{
    try {
        //get the domain name and start the connection to the tenent db
        console.log("all tenents data",tenentCache);
        let user_tenant_data = "";
        // console.log(req.session.user);
        if(!req.session.user){
            const {user_tenant} = req.body;
            user_tenant_data = user_tenant;
        }

        const domain = req.session?.user?.tenant || user_tenant_data;
        const tenent_list = tenentCache.tenent;
        console.log("tenent domain ===",domain)
        //filter one records which req from frontend
        
        let active_tenent = tenent_list.find(single_tenent_data=>single_tenent_data.D_domain === domain)
        
        // console.log('the filtered record',active_tenent);

        if (active_tenent) {
            console.log("tenent found",active_tenent);
        } else {
            console.log('user not found',active_tenent);
        }

        if (active_tenent.D_payment != 'done') {
            return res.status(403).json({ message: "payment is pending" });
        }
        console.log(active_tenent.D_dbname)
        
        //get the tenent Db connection
        const tenentDb = await gettenentDb(active_tenent.D_dbname);
        req.db = tenentDb;
        req.tenent = active_tenent;
        
        // console.log(next)
        next();
    } catch (error) {
        console.log('something wornge in tenent middleware',error)
        manualLog(`error in tenent middleware :: ${JSON.stringify(error)}`)
        res.status(500).json({message:'something wrong with the tenent middleware',error: error});
    }
}

module.exports = tenent_checker
