const rateLimit = require("express-rate-limit");

const isProduction = process.env.NODE_ENV === "production";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProduction ? 100 : 1000, // max requests per window per IP
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  skipFailedRequests: true, // Don't count failed requests (optional)
});
// Creates a rate limiter middleware

const createRateLimiter = (maxAttempts = 100, minutes = 15) => {
  return rateLimit({
    windowMs: minutes * 60 * 1000, // Convert minutes to milliseconds
    max: maxAttempts,
    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false, // Disable X-RateLimit-* headers
    message: {
      success: false,
      message: `Too many requests. Try again after ${minutes} minute(s).`,
    },
    skipFailedRequests: true, // Optional: don't count failed requests
  });
};

module.exports = { limiter, createRateLimiter };
