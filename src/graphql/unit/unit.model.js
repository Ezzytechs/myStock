const mongoose = require("mongoose");

const unitSchema = new mongoose.Schema(
  {
    name: { type: String },
    description: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Unit", unitSchema);
