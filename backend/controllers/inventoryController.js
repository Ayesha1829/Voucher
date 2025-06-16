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
const Category = require('../models/category');

/**
 * Get all inventory items with pagination and filtering
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const getAllItems = async (req, res) => {
  try {
    const { category, status, search, page = 1, limit = 10 } = req.query;

    // Build filter
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { itemName: { $regex: search, $options: 'i' } },
        { itemCode: { $regex: search, $options: 'i' } }
      ];
    }

    const items = await Inventory.find(filter)
      .populate('category', 'name')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Inventory.countDocuments(filter);

    logger.info(`Retrieved ${items.length} inventory items`);

    res.json(
      successResponse('Inventory items retrieved successfully', {
        items,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      })
    );
  } catch (error) {
    logger.error('Get all items error:', error);
    res.status(500).json(
      errorResponse('Failed to retrieve inventory items')
    );
  }
};

/**
 * Get inventory item by ID
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Inventory.findById(id)
      .populate('category', 'name')
      .populate('createdBy', 'name email');

    if (!item) {
      return res.status(404).json(
        errorResponse('Inventory item not found')
      );
    }

    logger.info(`Retrieved inventory item: ${id}`, {
      itemId: id,
      itemName: item.itemName
    });

    res.json(
      successResponse('Inventory item retrieved successfully', item)
    );
  } catch (error) {
    logger.error('Get item by ID error:', error);
    res.status(500).json(
      errorResponse('Failed to retrieve inventory item')
    );
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
      itemName,
      itemCode,
      qty,
      category,
      unit,
      rate,
      minStockLevel = 5
    } = req.body;

    // Check if item code already exists
    const existingItem = await Inventory.findOne({ itemCode });
    if (existingItem) {
      return res.status(409).json(
        errorResponse('Item code already exists')
      );
    }

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json(
        errorResponse('Invalid category ID')
      );
    }

    // Create new inventory item
    const newItem = new Inventory({
      itemName: itemName.trim(),
      itemCode: itemCode.trim(),
      qty: Number(qty),
      category,
      unit: unit.trim(),
      rate: Number(rate),
      total: Number(qty) * Number(rate), // Will be calculated in pre-save hook
      minStockLevel: Number(minStockLevel),
      createdBy: req.user?.id
    });

    await newItem.save();

    // Populate the category and createdBy fields for response
    await newItem.populate('category', 'name');
    await newItem.populate('createdBy', 'name email');

    logger.info(`New inventory item created: ${itemCode}`, {
      itemId: newItem._id,
      itemCode,
      createdBy: req.user?.id,
      qty
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
    const { id } = req.params;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(
        errorResponse('Validation failed', errors.array())
      );
    }

    const {
      itemName,
      itemCode,
      qty,
      category,
      unit,
      rate,
      minStockLevel,
      isActive
    } = req.body;

    // Check if item exists
    const item = await Inventory.findById(id);
    if (!item) {
      return res.status(404).json(
        errorResponse('Inventory item not found')
      );
    }

    // Check if item code already exists (excluding current item)
    if (itemCode && itemCode !== item.itemCode) {
      const existingItem = await Inventory.findOne({
        itemCode,
        _id: { $ne: id }
      });

      if (existingItem) {
        return res.status(409).json(
          errorResponse('Item code already exists')
        );
      }
    }

    // Verify category exists if provided
    if (category && category !== item.category.toString()) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json(
          errorResponse('Invalid category ID')
        );
      }
    }

    // Update item
    const updateData = {};
    if (itemName) updateData.itemName = itemName.trim();
    if (itemCode) updateData.itemCode = itemCode.trim();
    if (qty !== undefined) updateData.qty = Number(qty);
    if (category) updateData.category = category;
    if (unit) updateData.unit = unit.trim();
    if (rate !== undefined) updateData.rate = Number(rate);
    if (minStockLevel !== undefined) updateData.minStockLevel = Number(minStockLevel);
    if (isActive !== undefined) updateData.isActive = isActive;
    updateData.updatedAt = new Date();

    const updatedItem = await Inventory.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'name').populate('createdBy', 'name email');

    logger.info(`Inventory item updated: ${id}`, {
      itemId: id,
      itemName: updatedItem.itemName,
      updatedBy: req.user?.id
    });

    res.json(
      successResponse('Inventory item updated successfully', updatedItem)
    );
  } catch (error) {
    logger.error('Update inventory item error:', error);
    res.status(500).json(
      errorResponse('Failed to update inventory item')
    );
  }
};

/**
 * Delete inventory item
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Inventory.findById(id);
    if (!item) {
      return res.status(404).json(
        errorResponse('Inventory item not found')
      );
    }

    await Inventory.findByIdAndDelete(id);

    logger.info(`Inventory item deleted: ${id}`, {
      itemId: id,
      itemName: item.itemName,
      deletedBy: req.user?.id
    });

    res.json(
      successResponse('Inventory item deleted successfully')
    );
  } catch (error) {
    logger.error('Delete inventory item error:', error);
    res.status(500).json(
      errorResponse('Failed to delete inventory item')
    );
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

    const item = await Inventory.findById(id);
    if (!item) {
      return res.status(404).json(
        errorResponse('Inventory item not found')
      );
    }

    const oldQuantity = item.qty;
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

    // Update the item
    item.qty = newQuantity;
    await item.save(); // This will trigger the pre-save hook to update total and status

    logger.info(`Stock updated for item: ${id}`, {
      itemId: id,
      itemCode: item.itemCode,
      oldQuantity,
      newQuantity,
      operation,
      reason,
      updatedBy: req.user?.id
    });

    res.json(
      successResponse('Stock updated successfully', {
        id,
        itemCode: item.itemCode,
        oldQuantity,
        newQuantity,
        status: item.status,
        total: item.total
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
    const lowStockItems = await Inventory.find({
      isActive: true,
      $expr: { $lte: ['$qty', '$minStockLevel'] }
    })
    .populate('category', 'name')
    .populate('createdBy', 'name email')
    .sort({ qty: 1 });

    logger.info(`Retrieved ${lowStockItems.length} low stock items`);

    res.json(
      successResponse('Low stock items retrieved successfully', lowStockItems)
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
    const activeItems = await Inventory.find({ isActive: true })
      .populate('category', 'name');

    const totalItems = activeItems.length;
    const totalValue = activeItems.reduce((sum, item) => sum + item.total, 0);
    const lowStockCount = activeItems.filter(item => item.qty <= item.minStockLevel).length;
    const outOfStockCount = activeItems.filter(item => item.qty === 0).length;

    // Group by category
    const categoryStats = {};
    for (const item of activeItems) {
      const categoryName = item.category?.name || 'Uncategorized';
      if (!categoryStats[categoryName]) {
        categoryStats[categoryName] = { count: 0, value: 0 };
      }
      categoryStats[categoryName].count++;
      categoryStats[categoryName].value += item.total;
    }

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

/**
 * Create multiple inventory items (for bulk stock addition)
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const createMultipleItems = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(
        errorResponse('Validation failed', errors.array())
      );
    }

    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json(
        errorResponse('Items array is required and cannot be empty')
      );
    }

    const createdItems = [];
    const errors_list = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      try {
        // Check if item code already exists
        const existingItem = await Inventory.findOne({ itemCode: item.itemCode });
        if (existingItem) {
          errors_list.push(`Item ${i + 1}: Item code '${item.itemCode}' already exists`);
          continue;
        }

        // Verify category exists
        const categoryExists = await Category.findById(item.category);
        if (!categoryExists) {
          errors_list.push(`Item ${i + 1}: Invalid category ID`);
          continue;
        }

        // Create new inventory item
        const newItem = new Inventory({
          itemName: item.itemName.trim(),
          itemCode: item.itemCode.trim(),
          qty: Number(item.qty),
          category: item.category,
          unit: item.unit.trim(),
          rate: Number(item.rate),
          total: Number(item.qty) * Number(item.rate),
          minStockLevel: item.minStockLevel || 5,
          createdBy: req.user?.id
        });

        await newItem.save();
        await newItem.populate('category', 'name');

        createdItems.push(newItem);

      } catch (error) {
        errors_list.push(`Item ${i + 1}: ${error.message}`);
      }
    }

    logger.info(`Created ${createdItems.length} inventory items`, {
      totalRequested: items.length,
      created: createdItems.length,
      errors: errors_list.length,
      createdBy: req.user?.id
    });

    res.status(201).json(
      successResponse('Inventory items processed', {
        created: createdItems,
        errors: errors_list,
        summary: {
          totalRequested: items.length,
          successfullyCreated: createdItems.length,
          failed: errors_list.length
        }
      })
    );
  } catch (error) {
    logger.error('Create multiple items error:', error);
    res.status(500).json(
      errorResponse('Failed to create inventory items')
    );
  }
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  createMultipleItems,
  updateItem,
  deleteItem,
  updateStock,
  getLowStockItems,
  getInventoryStats
};
