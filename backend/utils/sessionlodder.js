const session = require("express-session");
const MongoStore = require("connect-mongo");

const mongoUrl = process.env.MONGODB_URL + "user_master"

const isProduction = false;

module.exports = session({
  secret: process.env.SESSION_SECRET || "fallbackSecretKey",
  resave: false,
  saveUninitialized: false,
  name: "user_session",
  proxy: true, // important when behind Coolify or any proxy

  store: MongoStore.create({
    mongoUrl,
    collectionName: "sessions",
  }),

  cookie: {
    maxAge: 1000 * 60 * 60, // 1 hour
    httpOnly: true,
    secure: false, // ✅ only secure in production
    // sameSite: isProduction ? "none" : "lax", // ✅ avoid cookie issues in dev
  },
});
