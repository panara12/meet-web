const gettenentDb = require('../tenent');
const Tenent = require('../models/tenent_model');
const NodeCache = require('node-cache');

const middleCache = new NodeCache({stdTTL:300});

const tenent_checker = async(req,res,next)=>{
    try {
        //get the domain name and start the connection to the tenent db

        // const domain = req.headers.host.split(":")[0];
        const domain = req.headers['x-tenant-domain']||'abcmarketing';
        let tenent = middleCache[domain];
        console.log(tenent);

        if(!middleCache[domain]){
            tenent = await Tenent.findOne({ D_domain: domain });
            if (!tenent) {
                return res.status(403).json({ message: "tenent not found" });
            }
            middleCache[domain] = tenent; // cache it
        }

        if (tenent.payment == 'done') {
            return res.status(403).json({ message: "payment is pending" });
        }
        console.log(tenent.D_dbname)
        const tenentDb = await gettenentDb(tenent.D_dbname);

        req.db = tenentDb;
        req.tenent = tenent;

        next();
    } catch (error) {
        console.log('something wornge in tenent middleware')
        res.status(500).json({message:'something wrong with the tenent middleware'});
    }
}

module.exports = tenent_checker