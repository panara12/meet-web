const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,   // 1 minute
  max: 20,                   // allow 20 requests per minute per IP
  message: { message: "Too many requests, please try again later" }
});

module.exports = limiter;
