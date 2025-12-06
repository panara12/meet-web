const mongoose = require("mongoose");
const express = require("express");
const env = require("dotenv").config();
const cors = require("cors");

const distributer = require("./routes/distributer");
const tenent_middleware = require("./middleware/tenent_middleware");
const getTenentList = require("./utils/tenentgeter");
const seller = require("./routes/seller");
const product = require("./routes/product");
const auth = require("./routes/auth");
const user_routes = require("./routes/user_routes");
const salesman_notes = require("./routes/salesman_notes_routes");
const order = require("./routes/order");
const tenent = require("./routes/tenent");
const tenentCache = require("./cache/tenent_list");
const errorHandler = require("./utils/errorHandler");
const manualLog = require("./utils/manuallogger");
const company = require("./routes/company");
const sessionLoader = require("./utils/sessionlodder");
const Location = require("./routes/location");
const email = require("./routes/email");
const payment = require("./routes/payment");
const sendScheduleEmails  = require("./routes/vvtmails");
const limiter = require("./middleware/ratelimit");

const app = express();
app.set('trust proxy', 1);
// ====== CORS ======
const allowedOrigins = ["https://oms.voidvortextech.com","https://voidvortextech.com"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman or server-side requests
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS not allowed"));
    },
    credentials: true,
  })
);

// ====== Middleware ======
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ====== MongoDB Connection ======
async function connectDB() {
  try {
    // Ensure MONGODB_URL ends with a slash, or add one
    let mongoUrl = process.env.MONGODB_URL;
    if (!mongoUrl.endsWith("/")) mongoUrl += "/";

    const fullUri = `${mongoUrl}user_master?authSource=admin`;

    await mongoose.connect(fullUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ MongoDB connected successfully");

    const tenent_list = await getTenentList();
    tenentCache.tenent = tenent_list;
    console.log("Loaded tenants:", tenentCache.tenent.length);

    manualLog("✅ Database connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    manualLog("❌ MongoDB connection failed: " + err.message);
    process.exit(1); // stop app if DB fails
  }
}

// Connect to MongoDB
connectDB();

manualLog("session is ready to go");

// ====== Routes ======
app.use(sessionLoader);

app.use("/tenent", tenent);
app.use("/company", tenent_middleware, company);
app.use("/auth", auth);
app.use("/distributer", tenent_middleware, distributer);
app.use("/seller", tenent_middleware, seller);
app.use("/order", tenent_middleware, order);
app.use("/user", tenent_middleware, user_routes);
app.use("/product", tenent_middleware, product);
app.use("/location", tenent_middleware, Location);
app.use("/payment", tenent_middleware, payment);
app.use("/saleman-notes", tenent_middleware, salesman_notes);
app.use('/api', sendScheduleEmails);
app.use("/email", email);

// ====== Test Route ======
app.get("/", (req, res) => res.send("Server running ✅"));
app.get("/error", () => {
  throw new Error("Test error for logging!");
});

app.get("/session-test", (req, res) => {
  req.session.views = (req.session.views || 0) + 1;
  res.send({ views: req.session.views });
});


// ====== Error Handler ======
app.use(errorHandler);

// ====== Start Server ======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
