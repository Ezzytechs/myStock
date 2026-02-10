const isProduction = process.env.NODE_ENV === "production";

// Allowed origins
const allowedOrigins = isProduction
  ? [`${process.env.FRONTEND_URL}`]
  : ["http://localhost:3000", "http://127.0.0.1:3000"];

module.exports = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: Access denied from ${origin}`));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers choke on 204
};
