const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
  type: { type: String, enum: ['purchase', 'sales', 'purchaseReturn', 'salesReturn'], required: true },
  voucherId: { type: String, required: true, unique: true }, // PV 355, SV 123, etc.
  date: { type: String, required: true }, // Store as formatted date string
  items: [{
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true },
    rate: { type: Number, required: true },
    unit: String,
    category: String
  }],
  supplier: String, // For purchase vouchers
  party: String,    // For sales vouchers
  total: { type: Number, required: true },
  entries: { type: Number, default: 0 }, // Number of items
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Voucher', voucherSchema);
