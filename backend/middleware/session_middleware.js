const session = require('express-session')
const MongoStore = require('connect-mongo')
const { v4: uuidv4 } = require('uuid');

module.exports = (req,res,next)=>{
    const tenent = req.headers['x-tenent-domain'];
    const cookieName = `sid_${ uuidv4()}`;
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