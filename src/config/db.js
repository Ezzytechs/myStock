const mongoose = require("mongoose");
const uri = "mongodb://localhost:27017/mystock";
const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("MongoDB Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
