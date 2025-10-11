const session = require("express-session");
const MongoStore = require("connect-mongo");

const mongoUrl = process.env.MONGODB_URL + "user_master"

const isProduction = true;

module.exports = session({
  secret: process.env.SESSION_SECRET || "fallbackSecretKey", // ✅ Fallback for safety
  resave: false,
  saveUninitialized: false,
  name: "user_session",

  store: MongoStore.create({
    mongoUrl,
    collectionName: "sessions",
  }),

  cookie: {
    maxAge: 1000 * 60 * 60, // 1 hour
    httpOnly: true,
    secure: true, // ✅ only secure in production
    sameSite: "none", // ✅ avoid cookie issues in dev
  },
});
