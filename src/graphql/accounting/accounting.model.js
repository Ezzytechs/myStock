const mongoose = require("mongoose");

const accountingSchema = new mongoose.Schema(
  {
    stock: { type: mongoose.Schema.Types.ObjectId, ref: "Stock" },
    amountBeforeExpense: { type: Number, default: 0 },
    amountAfterExpense: { type: Number, default: 0 },
    amountSold: { type: Number, default: 0 },
    dateSold: Date,
    leastSale: { type: Number, default: 0 },
    netChange: { type: Number, default: 0 },
    remark: {
      type: String,
      enum: ["profit", "loss", "neutral", "initial"],
      default: "initial",
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Accounting", accountingSchema);
