const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
  type: { type: String, enum: ['purchase', 'sales', 'purchaseReturn', 'salesReturn'], required: true },
  items: [{
    name: String,
    quantity: Number,
    price: Number
  }],
  total: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Voucher', voucherSchema);
