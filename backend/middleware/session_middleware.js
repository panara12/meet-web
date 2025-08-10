const session = require('express-session')
const MongoStore = require('connect-mongo')
const crypto = require('crypto');

module.exports =  (req,res,next)=>{
    console.time('enterd in session middleware')
    const tenent = req.headers['x-tenent-domain'];
    const {username} = req.body;
    const userIdHash = crypto.createHash('md5').update(username).digest('hex');
    const cookieName = `sid_${tenent}_${userIdHash}`;
    console.log(cookieName);
    console.timeEnd('enterd in session middleware')
    session({
        name:cookieName,
        secret:process.env.SESSION_SECRET,
        resave:false,
        saveUninitialized:false,
        store:MongoStore.create({
            mongoUrl:process.env.MONGODB_URL,
            collectionName:'user_session',
        }),
        cookie:{
            maxAge:1000*60*60,
            httpOnly:false,
            secure:false
        }
    })(req,res,next);
}