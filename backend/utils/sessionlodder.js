// sessionLoader.js (global)
const session = require('express-session');
const MongoStore = require('connect-mongo');

module.exports = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL,
        collectionName: 'user_session',
    }),
    cookie: {
        maxAge: 1000 * 60 * 2,//for 2 mins
        httpOnly: false,
        secure: false
    }
});
