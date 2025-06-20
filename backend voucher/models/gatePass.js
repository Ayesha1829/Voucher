const mongoose = require("mongoose");

const gatePassSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    party: {
      type: String,
      required: true,
    },
    orderNumber: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    detail: {
      type: String,
      required: true,
    },
    qty: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GatePass", gatePassSchema);
