const session = require("express-session");
const MongoStore = require("connect-mongo");

const mongoUrl = process.env.MONGODB_URL + "user_master";

app.use(session({
  secret: process.env.SESSION_SECRET || "fallbackSecretKey",
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
    secure: true,
    sameSite: "none", // "none" for cross-site in production
  },
}));
