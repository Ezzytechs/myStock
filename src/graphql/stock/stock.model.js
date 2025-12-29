const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    price: { type: number, deafult: 0 },
    unit: { type: mongoose.Schema.Types.ObjectId, ref: "Unit" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: string, enum: ["open", "closed"] },
    date: Date,
    expenses: [{ name: String, price: String, details: String }],
    totalUnit: { type: number, deafult: 0 },
    totalAmount: { type: number, deafult: 0 },
    totalExpenses: { type: number, deafult: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stock", stockSchema);
