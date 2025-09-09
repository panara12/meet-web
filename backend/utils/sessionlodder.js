const session = require('express-session');
const MongoStore = require('connect-mongo');

module.exports = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: 'user_session',
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL+'user_master',
        collectionName: 'sessions'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60, // 2 min
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }
});
