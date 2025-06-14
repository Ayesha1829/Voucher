const { validationResult } = require('express-validator');
const { 
  successResponse, 
  errorResponse, 
  validatePagination, 
  getPaginationMeta,
  formatCurrency
} = require('../utils/helpers');
const logger = require('../utils/logger');
const Inventory = require('../models/inventory');

// In-memory inventory store (in a real app, this would be a database)
let inventory = [
  {
    id: '1',
    name: 'Summer T-Shirt',
    description: 'Comfortable cotton t-shirt perfect for summer',
    sku: 'TSH-SUM-001',
    category: 'clothing',
    subcategory: 'shirts',
    brand: 'FashionCo',
    price: 29.99,
    costPrice: 15.00,
    quantity: 150,
    minStockLevel: 20,
    maxStockLevel: 200,
    unit: 'piece',
    weight: 0.2,
    dimensions: {
      length: 30,
      width: 25,
      height: 2
    },
    images: ['tshirt1.jpg', 'tshirt2.jpg'],
    tags: ['summer', 'casual', 'cotton'],
    isActive: true,
    createdBy: '1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    supplier: {
      name: 'Textile Supplier Inc',
      contact: 'supplier@textile.com'
    }
  },
  {
    id: '2',
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    sku: 'HP-WRL-002',
    category: 'electronics',
    subcategory: 'audio',
    brand: 'AudioTech',
    price: 199.99,
    costPrice: 120.00,
    quantity: 75,
    minStockLevel: 10,
    maxStockLevel: 100,
    unit: 'piece',
    weight: 0.3,
    dimensions: {
      length: 20,
      width: 18,
      height: 8
    },
    images: ['headphones1.jpg', 'headphones2.jpg'],
    tags: ['wireless', 'audio', 'noise-cancellation'],
    isActive: true,
    createdBy: '1',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    supplier: {
      name: 'Electronics Distributor',
      contact: 'orders@electronics.com'
    }
  }
];

/**
 * Get all inventory items with pagination and filtering
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const getAllItems = async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get inventory item by ID
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const getItemById = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Create new inventory item
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const createItem = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(
        errorResponse('Validation failed', errors.array())
      );
    }
    
    const {
      name,
      description,
      sku,
      category,
      subcategory,
      brand,
      price,
      costPrice,
      quantity,
      minStockLevel,
      maxStockLevel,
      unit = 'piece',
      weight,
      dimensions,
      images = [],
      tags = [],
      supplier
    } = req.body;
    
    // Check if SKU already exists
    const existingItem = inventory.find(i => i.sku === sku);
    if (existingItem) {
      return res.status(409).json(
        errorResponse('SKU already exists')
      );
    }
    
    // Create new inventory item
    const newItem = {
      id: (inventory.length + 1).toString(),
      name,
      description,
      sku,
      category,
      subcategory,
      brand,
      price,
      costPrice,
      quantity,
      minStockLevel,
      maxStockLevel,
      unit,
      weight,
      dimensions,
      images,
      tags,
      isActive: true,
      createdBy: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      supplier
    };
    
    inventory.push(newItem);
    
    logger.info(`New inventory item created: ${sku}`, {
      itemId: newItem.id,
      sku,
      createdBy: req.user.id,
      quantity
    });
    
    res.status(201).json(
      successResponse('Inventory item created successfully', newItem)
    );
  } catch (error) {
    logger.error('Create inventory item error:', error);
    res.status(500).json(
      errorResponse('Failed to create inventory item')
    );
  }
};

/**
 * Update inventory item
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const updateItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Delete inventory item
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const deleteItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update stock quantity
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, operation = 'set', reason } = req.body;
    
    const itemIndex = inventory.findIndex(i => i.id === id);
    if (itemIndex === -1) {
      return res.status(404).json(
        errorResponse('Inventory item not found')
      );
    }
    
    const oldQuantity = inventory[itemIndex].quantity;
    let newQuantity;
    
    switch (operation) {
      case 'add':
        newQuantity = oldQuantity + quantity;
        break;
      case 'subtract':
        newQuantity = Math.max(0, oldQuantity - quantity);
        break;
      case 'set':
      default:
        newQuantity = quantity;
        break;
    }
    
    inventory[itemIndex].quantity = newQuantity;
    inventory[itemIndex].updatedAt = new Date();
    
    logger.info(`Stock updated for item: ${id}`, {
      itemId: id,
      sku: inventory[itemIndex].sku,
      oldQuantity,
      newQuantity,
      operation,
      reason,
      updatedBy: req.user.id
    });
    
    res.json(
      successResponse('Stock updated successfully', {
        id,
        sku: inventory[itemIndex].sku,
        oldQuantity,
        newQuantity,
        stockStatus: getStockStatus(inventory[itemIndex])
      })
    );
  } catch (error) {
    logger.error('Update stock error:', error);
    res.status(500).json(
      errorResponse('Failed to update stock')
    );
  }
};

/**
 * Get low stock items
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const getLowStockItems = async (req, res) => {
  try {
    const lowStockItems = inventory.filter(item => 
      item.isActive && item.quantity <= item.minStockLevel
    );
    
    const itemsWithStatus = lowStockItems.map(item => ({
      ...item,
      stockStatus: getStockStatus(item),
      profitMargin: calculateProfitMargin(item.price, item.costPrice)
    }));
    
    logger.info(`Retrieved ${lowStockItems.length} low stock items`);
    
    res.json(
      successResponse('Low stock items retrieved successfully', itemsWithStatus)
    );
  } catch (error) {
    logger.error('Get low stock items error:', error);
    res.status(500).json(
      errorResponse('Failed to retrieve low stock items')
    );
  }
};

/**
 * Get inventory statistics
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const getInventoryStats = async (req, res) => {
  try {
    const activeItems = inventory.filter(item => item.isActive);
    const totalItems = activeItems.length;
    const totalValue = activeItems.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0);
    const lowStockCount = activeItems.filter(item => item.quantity <= item.minStockLevel).length;
    const outOfStockCount = activeItems.filter(item => item.quantity === 0).length;
    
    const categoryStats = activeItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = { count: 0, value: 0 };
      }
      acc[item.category].count++;
      acc[item.category].value += item.quantity * item.costPrice;
      return acc;
    }, {});
    
    const stats = {
      totalItems,
      totalValue,
      lowStockCount,
      outOfStockCount,
      categoryStats,
      averageItemValue: totalItems > 0 ? totalValue / totalItems : 0
    };
    
    logger.info('Retrieved inventory statistics');
    
    res.json(
      successResponse('Inventory statistics retrieved successfully', stats)
    );
  } catch (error) {
    logger.error('Get inventory stats error:', error);
    res.status(500).json(
      errorResponse('Failed to retrieve inventory statistics')
    );
  }
};

// Helper functions
const getStockStatus = (item) => {
  if (item.quantity === 0) return 'out_of_stock';
  if (item.quantity <= item.minStockLevel) return 'low_stock';
  if (item.quantity >= item.maxStockLevel) return 'overstock';
  return 'in_stock';
};

const calculateProfitMargin = (price, costPrice) => {
  if (costPrice === 0) return 0;
  return ((price - costPrice) / price * 100).toFixed(2);
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  updateStock,
  getLowStockItems,
  getInventoryStats
};
