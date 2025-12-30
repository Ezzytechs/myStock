const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      require: [true, "Category is required"],
    },
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      require: [true, "Unit is required"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: [true, "Owner is required"],
    },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    totalUnit: { type: Number, deafult: 0 },
    amountPerUnit: {
      type: Number,
      deafult: 0,
      require: [true, "Amount per unit is required"],
    },
    totalAmount: { type: Number, deafult: 0 },
    expenses: [{ name: String, price: Number, details: String }],
    totalExpenses: { type: Number, deafult: 0 },
    accounting: { type: mongoose.Schema.Types.ObjectId, ref: "Accounting" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stock", stockSchema);
