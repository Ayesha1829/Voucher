const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
    trim: true
  },
  itemCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  qty: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  unit: {
    type: String,
    required: true,
    trim: true
  },
  rate: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  dateAdded: {
    type: String,
    default: () => new Date().toLocaleDateString('en-GB') // dd/mm/yyyy format
  },
  status: {
    type: String,
    enum: ['Active', 'Low Stock', 'Out of Stock'],
    default: 'Active'
  },
  minStockLevel: {
    type: Number,
    default: 5
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
inventorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();

  // Auto-calculate total
  this.total = this.qty * this.rate;

  // Auto-update status based on quantity
  if (this.qty === 0) {
    this.status = 'Out of Stock';
  } else if (this.qty <= this.minStockLevel) {
    this.status = 'Low Stock';
  } else {
    this.status = 'Active';
  }

  next();
});

module.exports = mongoose.model('Inventory', inventorySchema);
