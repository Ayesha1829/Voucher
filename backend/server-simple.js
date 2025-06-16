const express = require('express');
const cors = require('cors');

// Create Express app
const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory storage for testing
let categories = [
  {
    _id: 'cat1',
    name: 'Electronics',
    description: 'Electronic items',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'cat2',
    name: 'Clothing',
    description: 'Clothing items',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let inventory = [
  {
    _id: 'inv1',
    itemName: 'Laptop',
    itemCode: 'LAP001',
    qty: 10,
    category: {
      _id: 'cat1',
      name: 'Electronics'
    },
    unit: 'Pieces',
    rate: 1000,
    total: 10000,
    dateAdded: new Date().toLocaleDateString('en-GB'),
    status: 'Active',
    minStockLevel: 5,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let purchaseReturns = [];
let salesReturns = [];
let purchaseVouchers = [];
let salesVouchers = [];

let nextId = 3;

// Helper functions
const successResponse = (message, data = null) => ({
  success: true,
  message,
  data
});

const errorResponse = (message, errors = null) => ({
  success: false,
  message,
  errors
});

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('📋 Health check requested');
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    server: 'Simple Voucher API',
    categories: categories.length,
    inventory: inventory.length
  });
});

// Root endpoint
app.get('/', (req, res) => {
  console.log('📋 Root endpoint requested');
  res.json({
    message: 'Voucher API Server',
    status: 'running',
    endpoints: {
      health: '/health',
      categories: '/api/categories',
      inventory: '/api/inventory'
    }
  });
});

// Category routes
app.get('/api/categories/test', (req, res) => {
  res.json({ success: true, message: 'Category routes working!' });
});

app.get('/api/categories', (req, res) => {
  res.json(successResponse('Categories retrieved successfully', categories));
});

app.post('/api/categories', (req, res) => {
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json(errorResponse('Category name is required'));
  }
  
  // Check if category already exists
  const existingCategory = categories.find(cat => 
    cat.name.toLowerCase() === name.toLowerCase()
  );
  
  if (existingCategory) {
    return res.status(409).json(errorResponse('Category already exists'));
  }
  
  const newCategory = {
    _id: 'cat' + nextId++,
    name: name.trim(),
    description: description?.trim() || '',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  categories.push(newCategory);
  
  res.status(201).json(successResponse('Category created successfully', newCategory));
});

// Inventory routes
app.get('/api/inventory/test', (req, res) => {
  res.json({ success: true, message: 'Inventory routes working!' });
});

app.get('/api/inventory', (req, res) => {
  res.json(successResponse('Inventory items retrieved successfully', {
    items: inventory,
    pagination: {
      page: 1,
      limit: 10,
      total: inventory.length,
      pages: 1
    }
  }));
});

app.post('/api/inventory', (req, res) => {
  const { itemName, itemCode, qty, category, unit, rate } = req.body;
  
  if (!itemName || !itemCode || !qty || !category || !unit || !rate) {
    return res.status(400).json(errorResponse('All fields are required'));
  }
  
  // Check if item code already exists
  const existingItem = inventory.find(item => item.itemCode === itemCode);
  if (existingItem) {
    return res.status(409).json(errorResponse('Item code already exists'));
  }
  
  // Find category
  const categoryObj = categories.find(cat => cat._id === category);
  if (!categoryObj) {
    return res.status(400).json(errorResponse('Invalid category'));
  }
  
  const newItem = {
    _id: 'inv' + nextId++,
    itemName: itemName.trim(),
    itemCode: itemCode.trim(),
    qty: Number(qty),
    category: {
      _id: categoryObj._id,
      name: categoryObj.name
    },
    unit: unit.trim(),
    rate: Number(rate),
    total: Number(qty) * Number(rate),
    dateAdded: new Date().toLocaleDateString('en-GB'),
    status: Number(qty) === 0 ? 'Out of Stock' : Number(qty) <= 5 ? 'Low Stock' : 'Active',
    minStockLevel: 5,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  inventory.push(newItem);
  
  res.status(201).json(successResponse('Inventory item created successfully', newItem));
});

app.post('/api/inventory/bulk', (req, res) => {
  const { items } = req.body;
  
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json(errorResponse('Items array is required'));
  }
  
  const created = [];
  const errors = [];
  
  items.forEach((item, index) => {
    try {
      const { itemName, itemCode, qty, category, unit, rate } = item;
      
      if (!itemName || !itemCode || !qty || !category || !unit || !rate) {
        errors.push(`Item ${index + 1}: All fields are required`);
        return;
      }
      
      // Check if item code already exists
      const existingItem = inventory.find(inv => inv.itemCode === itemCode);
      if (existingItem) {
        errors.push(`Item ${index + 1}: Item code '${itemCode}' already exists`);
        return;
      }
      
      // Find category
      const categoryObj = categories.find(cat => cat._id === category);
      if (!categoryObj) {
        errors.push(`Item ${index + 1}: Invalid category`);
        return;
      }
      
      const newItem = {
        _id: 'inv' + nextId++,
        itemName: itemName.trim(),
        itemCode: itemCode.trim(),
        qty: Number(qty),
        category: {
          _id: categoryObj._id,
          name: categoryObj.name
        },
        unit: unit.trim(),
        rate: Number(rate),
        total: Number(qty) * Number(rate),
        dateAdded: new Date().toLocaleDateString('en-GB'),
        status: Number(qty) === 0 ? 'Out of Stock' : Number(qty) <= 5 ? 'Low Stock' : 'Active',
        minStockLevel: 5,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      inventory.push(newItem);
      created.push(newItem);
      
    } catch (error) {
      errors.push(`Item ${index + 1}: ${error.message}`);
    }
  });
  
  res.status(201).json(successResponse('Items processed', {
    created,
    errors,
    summary: {
      totalRequested: items.length,
      successfullyCreated: created.length,
      failed: errors.length
    }
  }));
});

// Purchase Returns API endpoints

// Get all purchase returns
app.get('/api/purchase-returns', (req, res) => {
  try {
    res.json(successResponse('Purchase returns retrieved successfully', {
      items: purchaseReturns,
      pagination: {
        page: 1,
        limit: 10,
        total: purchaseReturns.length,
        pages: 1
      }
    }));
  } catch (error) {
    console.error('Error fetching purchase returns:', error);
    res.status(500).json(errorResponse('Internal server error'));
  }
});

// Create new purchase return
app.post('/api/purchase-returns', (req, res) => {
  try {
    const { id, date, numberOfEntries, description } = req.body;

    if (!id || !date || !numberOfEntries || !description) {
      return res.status(400).json(errorResponse('Missing required fields: id, date, numberOfEntries, description'));
    }

    const newPurchaseReturn = {
      _id: `pr${nextId++}`,
      id,
      prvId: id, // Use the generated ID as PRV ID
      dated: date,
      description,
      entries: numberOfEntries,
      status: 'Submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    purchaseReturns.push(newPurchaseReturn);

    res.status(201).json(successResponse('Purchase return created successfully', newPurchaseReturn));
  } catch (error) {
    console.error('Error creating purchase return:', error);
    res.status(500).json(errorResponse('Internal server error'));
  }
});

// Get purchase return by ID
app.get('/api/purchase-returns/:id', (req, res) => {
  try {
    const { id } = req.params;
    const purchaseReturn = purchaseReturns.find(pr => pr.id === id || pr._id === id);

    if (!purchaseReturn) {
      return res.status(404).json(errorResponse('Purchase return not found'));
    }

    res.json(successResponse('Purchase return retrieved successfully', purchaseReturn));
  } catch (error) {
    console.error('Error fetching purchase return:', error);
    res.status(500).json(errorResponse('Internal server error'));
  }
});

// Delete purchase return
app.delete('/api/purchase-returns/:id', (req, res) => {
  try {
    const { id } = req.params;
    const index = purchaseReturns.findIndex(pr => pr.id === id || pr._id === id);

    if (index === -1) {
      return res.status(404).json(errorResponse('Purchase return not found'));
    }

    const deletedReturn = purchaseReturns.splice(index, 1)[0];

    res.json(successResponse('Purchase return deleted successfully', deletedReturn));
  } catch (error) {
    console.error('Error deleting purchase return:', error);
    res.status(500).json(errorResponse('Internal server error'));
  }
});

// Sales Returns API endpoints

// Get all sales returns
app.get('/api/sales-returns', (req, res) => {
  try {
    res.json(successResponse('Sales returns retrieved successfully', {
      items: salesReturns,
      pagination: {
        page: 1,
        limit: 10,
        total: salesReturns.length,
        pages: 1
      }
    }));
  } catch (error) {
    console.error('Error fetching sales returns:', error);
    res.status(500).json(errorResponse('Internal server error'));
  }
});

// Create new sales return
app.post('/api/sales-returns', (req, res) => {
  try {
    const { id, date, numberOfEntries, description } = req.body;

    if (!id || !date || !numberOfEntries || !description) {
      return res.status(400).json(errorResponse('Missing required fields: id, date, numberOfEntries, description'));
    }

    const newSalesReturn = {
      _id: `sr${nextId++}`,
      id,
      srvId: id, // Use the generated ID as SRV ID
      dated: date,
      description,
      entries: numberOfEntries,
      status: 'Submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    salesReturns.push(newSalesReturn);

    res.status(201).json(successResponse('Sales return created successfully', newSalesReturn));
  } catch (error) {
    console.error('Error creating sales return:', error);
    res.status(500).json(errorResponse('Internal server error'));
  }
});

// Get sales return by ID
app.get('/api/sales-returns/:id', (req, res) => {
  try {
    const { id } = req.params;
    const salesReturn = salesReturns.find(sr => sr.id === id || sr._id === id);

    if (!salesReturn) {
      return res.status(404).json(errorResponse('Sales return not found'));
    }

    res.json(successResponse('Sales return retrieved successfully', salesReturn));
  } catch (error) {
    console.error('Error fetching sales return:', error);
    res.status(500).json(errorResponse('Internal server error'));
  }
});

// Delete sales return
app.delete('/api/sales-returns/:id', (req, res) => {
  try {
    const { id } = req.params;
    const index = salesReturns.findIndex(sr => sr.id === id || sr._id === id);

    if (index === -1) {
      return res.status(404).json(errorResponse('Sales return not found'));
    }

    const deletedReturn = salesReturns.splice(index, 1)[0];

    res.json(successResponse('Sales return deleted successfully', deletedReturn));
  } catch (error) {
    console.error('Error deleting sales return:', error);
    res.status(500).json(errorResponse('Internal server error'));
  }
});

// Purchase Voucher endpoints
app.get('/api/vouchers/purchase', (req, res) => {
  console.log('🔍 GET /api/vouchers/purchase called - Simple Server');
  try {
    const { page = 1, limit = 10 } = req.query;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedVouchers = purchaseVouchers.slice(startIndex, endIndex);

    res.json(successResponse('Purchase vouchers retrieved successfully', {
      vouchers: paginatedVouchers,
      total: purchaseVouchers.length,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(purchaseVouchers.length / limit)
    }));
  } catch (error) {
    console.error('Error fetching purchase vouchers:', error);
    res.status(500).json(errorResponse('Internal server error'));
  }
});

app.post('/api/vouchers/purchase', (req, res) => {
  console.log('🔍 POST /api/vouchers/purchase called - Simple Server');
  try {
    const { date, supplier, items } = req.body;

    if (!date || !supplier || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json(errorResponse('Missing required fields: date, supplier, and items are required'));
    }

    // Generate voucher ID
    const voucherId = `PV ${(purchaseVouchers.length + 1).toString().padStart(3, '0')}`;

    // Calculate total and entries
    const total = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const entries = items.length;

    const newVoucher = {
      _id: `pv${nextId++}`,
      voucherId,
      date,
      supplier,
      items,
      total,
      entries,
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    purchaseVouchers.push(newVoucher);

    res.status(201).json(successResponse('Purchase voucher created successfully', {
      id: newVoucher.voucherId,
      date: newVoucher.date,
      items: newVoucher.items,
      entries: newVoucher.entries,
      total: newVoucher.total
    }));
  } catch (error) {
    console.error('Error creating purchase voucher:', error);
    res.status(500).json(errorResponse('Internal server error'));
  }
});

// Sales Voucher endpoints
app.get('/api/vouchers/sales', (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedVouchers = salesVouchers.slice(startIndex, endIndex);

    res.json(successResponse('Sales vouchers retrieved successfully', {
      vouchers: paginatedVouchers,
      total: salesVouchers.length,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(salesVouchers.length / limit)
    }));
  } catch (error) {
    console.error('Error fetching sales vouchers:', error);
    res.status(500).json(errorResponse('Internal server error'));
  }
});

app.post('/api/vouchers/sales', (req, res) => {
  try {
    const { date, party, items } = req.body;

    if (!date || !party || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json(errorResponse('Missing required fields: date, party, and items are required'));
    }

    // Generate voucher ID
    const voucherId = `SV ${(salesVouchers.length + 1).toString().padStart(3, '0')}`;

    // Calculate total and entries
    const total = items.reduce((sum, item) => sum + (item.total || 0), 0);
    const entries = items.length;

    const newVoucher = {
      _id: `sv${nextId++}`,
      voucherId,
      date,
      party,
      items,
      total,
      entries,
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    salesVouchers.push(newVoucher);

    res.status(201).json(successResponse('Sales voucher created successfully', {
      id: newVoucher.voucherId,
      date: newVoucher.date,
      items: newVoucher.items,
      entries: newVoucher.entries,
      total: newVoucher.total
    }));
  } catch (error) {
    console.error('Error creating sales voucher:', error);
    res.status(500).json(errorResponse('Internal server error'));
  }
});

// Simple authentication endpoints (for compatibility)
app.post('/api/users/login', (req, res) => {
  // Simple mock authentication - always succeeds
  res.json(successResponse('Login successful', {
    token: 'mock-jwt-token-' + Date.now(),
    user: {
      id: 'user1',
      username: 'demo',
      email: 'demo@example.com'
    }
  }));
});

app.get('/api/users/me', (req, res) => {
  // Simple mock user info - always succeeds
  res.json(successResponse('User info retrieved', {
    id: 'user1',
    username: 'demo',
    email: 'demo@example.com'
  }));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Simple server running on port ${PORT}`);
  console.log(`🌐 Server listening on http://localhost:${PORT}`);
  console.log(`📊 Categories: ${categories.length}`);
  console.log(`📦 Inventory items: ${inventory.length}`);
  console.log(`🔄 Purchase returns: ${purchaseReturns.length}`);
  console.log(`💰 Sales returns: ${salesReturns.length}`);
  console.log(`📋 Purchase vouchers: ${purchaseVouchers.length}`);
  console.log(`💳 Sales vouchers: ${salesVouchers.length}`);
  console.log(`\n📋 Available endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/health`);
  console.log(`   GET  http://localhost:${PORT}/api/categories`);
  console.log(`   POST http://localhost:${PORT}/api/categories`);
  console.log(`   GET  http://localhost:${PORT}/api/inventory`);
  console.log(`   POST http://localhost:${PORT}/api/inventory`);
  console.log(`   POST http://localhost:${PORT}/api/inventory/bulk`);
  console.log(`   GET  http://localhost:${PORT}/api/purchase-returns`);
  console.log(`   POST http://localhost:${PORT}/api/purchase-returns`);
  console.log(`   GET  http://localhost:${PORT}/api/purchase-returns/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/purchase-returns/:id`);
  console.log(`   GET  http://localhost:${PORT}/api/sales-returns`);
  console.log(`   POST http://localhost:${PORT}/api/sales-returns`);
  console.log(`   GET  http://localhost:${PORT}/api/sales-returns/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/sales-returns/:id`);
  console.log(`   GET  http://localhost:${PORT}/api/vouchers/purchase`);
  console.log(`   POST http://localhost:${PORT}/api/vouchers/purchase`);
  console.log(`   GET  http://localhost:${PORT}/api/vouchers/sales`);
  console.log(`   POST http://localhost:${PORT}/api/vouchers/sales`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`❌ Port ${PORT} is already in use. Try a different port.`);
  } else {
    console.log('❌ Server error:', error);
  }
});

module.exports = app;
