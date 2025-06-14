const { validationResult } = require('express-validator');
const { 
  successResponse, 
  errorResponse, 
  validatePagination, 
  getPaginationMeta,
  generateVoucherCode,
  calculateDiscount,
  formatCurrency
} = require('../utils/helpers');
const logger = require('../utils/logger');
const Voucher = require('../models/voucher');

// In-memory voucher store (in a real app, this would be a database)
let vouchers = [
  {
    id: '1',
    code: 'VCH-123456-ABC',
    title: 'Summer Sale Voucher',
    description: 'Get 20% off on all summer items',
    type: 'percentage',
    value: 20,
    minOrderAmount: 100,
    maxDiscountAmount: 50,
    usageLimit: 100,
    usedCount: 15,
    isActive: true,
    validFrom: new Date('2024-06-01'),
    validUntil: new Date('2024-08-31'),
    createdBy: '1',
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-05-15'),
    categories: ['clothing', 'accessories'],
    applicableProducts: []
  },
  {
    id: '2',
    code: 'VCH-789012-DEF',
    title: 'New Customer Discount',
    description: 'Welcome bonus for new customers',
    type: 'fixed',
    value: 25,
    minOrderAmount: 50,
    maxDiscountAmount: null,
    usageLimit: 1000,
    usedCount: 234,
    isActive: true,
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2024-12-31'),
    createdBy: '1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    categories: [],
    applicableProducts: []
  }
];

/**
 * Get all vouchers with pagination and filtering
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const getAllVouchers = async (req, res) => {
  try {
    const { page, limit, search, type, isActive, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Validate pagination
    const { page: validatedPage, limit: validatedLimit, skip } = validatePagination(page, limit);
    
    // Filter vouchers
    let filteredVouchers = [...vouchers];
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredVouchers = filteredVouchers.filter(voucher =>
        voucher.title.toLowerCase().includes(searchLower) ||
        voucher.description.toLowerCase().includes(searchLower) ||
        voucher.code.toLowerCase().includes(searchLower)
      );
    }
    
    // Type filter
    if (type) {
      filteredVouchers = filteredVouchers.filter(voucher => voucher.type === type);
    }
    
    // Active status filter
    if (isActive !== undefined) {
      const activeStatus = isActive === 'true';
      filteredVouchers = filteredVouchers.filter(voucher => voucher.isActive === activeStatus);
    }
    
    // Sort vouchers
    filteredVouchers.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    // Apply pagination
    const total = filteredVouchers.length;
    const paginatedVouchers = filteredVouchers.slice(skip, skip + validatedLimit);
    
    // Get pagination metadata
    const paginationMeta = getPaginationMeta(validatedPage, validatedLimit, total);
    
    logger.info(`Retrieved ${paginatedVouchers.length} vouchers`, {
      total,
      page: validatedPage,
      limit: validatedLimit,
      filters: { search, type, isActive }
    });
    
    res.json(
      successResponse(
        'Vouchers retrieved successfully',
        paginatedVouchers,
        paginationMeta
      )
    );
  } catch (error) {
    logger.error('Get all vouchers error:', error);
    res.status(500).json(
      errorResponse('Failed to retrieve vouchers')
    );
  }
};

/**
 * Get voucher by ID
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const getVoucherById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const voucher = vouchers.find(v => v.id === id);
    
    if (!voucher) {
      return res.status(404).json(
        errorResponse('Voucher not found')
      );
    }
    
    logger.info(`Retrieved voucher: ${id}`, {
      voucherId: id,
      code: voucher.code
    });
    
    res.json(
      successResponse('Voucher retrieved successfully', voucher)
    );
  } catch (error) {
    logger.error('Get voucher by ID error:', error);
    res.status(500).json(
      errorResponse('Failed to retrieve voucher')
    );
  }
};

/**
 * Create new voucher
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const createVoucher = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(
        errorResponse('Validation failed', errors.array())
      );
    }
    
    const {
      title,
      description,
      type,
      value,
      minOrderAmount = 0,
      maxDiscountAmount,
      usageLimit,
      validFrom,
      validUntil,
      categories = [],
      applicableProducts = []
    } = req.body;
    
    // Generate unique voucher code
    const code = generateVoucherCode();
    
    // Check if code already exists (very unlikely but good to check)
    const existingVoucher = vouchers.find(v => v.code === code);
    if (existingVoucher) {
      return res.status(409).json(
        errorResponse('Voucher code already exists, please try again')
      );
    }
    
    // Create new voucher
    const newVoucher = {
      id: (vouchers.length + 1).toString(),
      code,
      title,
      description,
      type,
      value,
      minOrderAmount,
      maxDiscountAmount,
      usageLimit,
      usedCount: 0,
      isActive: true,
      validFrom: new Date(validFrom),
      validUntil: new Date(validUntil),
      createdBy: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      categories,
      applicableProducts
    };
    
    vouchers.push(newVoucher);
    
    logger.info(`New voucher created: ${code}`, {
      voucherId: newVoucher.id,
      code,
      createdBy: req.user.id,
      type,
      value
    });
    
    res.status(201).json(
      successResponse('Voucher created successfully', newVoucher)
    );
  } catch (error) {
    logger.error('Create voucher error:', error);
    res.status(500).json(
      errorResponse('Failed to create voucher')
    );
  }
};

/**
 * Update voucher
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const updateVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    
    const voucherIndex = vouchers.findIndex(v => v.id === id);
    if (voucherIndex === -1) {
      return res.status(404).json(
        errorResponse('Voucher not found')
      );
    }
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(
        errorResponse('Validation failed', errors.array())
      );
    }
    
    const updateData = req.body;
    
    // Update voucher
    vouchers[voucherIndex] = {
      ...vouchers[voucherIndex],
      ...updateData,
      updatedAt: new Date()
    };
    
    logger.info(`Voucher updated: ${id}`, {
      voucherId: id,
      updatedBy: req.user.id,
      changes: Object.keys(updateData)
    });
    
    res.json(
      successResponse('Voucher updated successfully', vouchers[voucherIndex])
    );
  } catch (error) {
    logger.error('Update voucher error:', error);
    res.status(500).json(
      errorResponse('Failed to update voucher')
    );
  }
};

/**
 * Delete voucher
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const deleteVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    
    const voucherIndex = vouchers.findIndex(v => v.id === id);
    if (voucherIndex === -1) {
      return res.status(404).json(
        errorResponse('Voucher not found')
      );
    }
    
    const deletedVoucher = vouchers.splice(voucherIndex, 1)[0];
    
    logger.info(`Voucher deleted: ${id}`, {
      voucherId: id,
      code: deletedVoucher.code,
      deletedBy: req.user.id
    });
    
    res.json(
      successResponse('Voucher deleted successfully')
    );
  } catch (error) {
    logger.error('Delete voucher error:', error);
    res.status(500).json(
      errorResponse('Failed to delete voucher')
    );
  }
};

/**
 * Validate voucher code
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const validateVoucher = async (req, res) => {
  try {
    const { code } = req.params;
    const { orderAmount = 0 } = req.query;
    
    const voucher = vouchers.find(v => v.code === code);
    
    if (!voucher) {
      return res.status(404).json(
        errorResponse('Voucher not found')
      );
    }
    
    // Check if voucher is active
    if (!voucher.isActive) {
      return res.status(400).json(
        errorResponse('Voucher is not active')
      );
    }
    
    // Check validity dates
    const now = new Date();
    if (now < voucher.validFrom) {
      return res.status(400).json(
        errorResponse('Voucher is not yet valid')
      );
    }
    
    if (now > voucher.validUntil) {
      return res.status(400).json(
        errorResponse('Voucher has expired')
      );
    }
    
    // Check usage limit
    if (voucher.usedCount >= voucher.usageLimit) {
      return res.status(400).json(
        errorResponse('Voucher usage limit exceeded')
      );
    }
    
    // Check minimum order amount
    if (orderAmount < voucher.minOrderAmount) {
      return res.status(400).json(
        errorResponse(`Minimum order amount is ${formatCurrency(voucher.minOrderAmount)}`)
      );
    }
    
    // Calculate discount
    let discountAmount = 0;
    if (voucher.type === 'percentage') {
      discountAmount = (orderAmount * voucher.value) / 100;
      if (voucher.maxDiscountAmount && discountAmount > voucher.maxDiscountAmount) {
        discountAmount = voucher.maxDiscountAmount;
      }
    } else if (voucher.type === 'fixed') {
      discountAmount = voucher.value;
    }
    
    const finalAmount = Math.max(0, orderAmount - discountAmount);
    
    logger.info(`Voucher validated: ${code}`, {
      code,
      orderAmount,
      discountAmount,
      finalAmount
    });
    
    res.json(
      successResponse('Voucher is valid', {
        voucher: {
          id: voucher.id,
          code: voucher.code,
          title: voucher.title,
          description: voucher.description,
          type: voucher.type,
          value: voucher.value
        },
        discount: {
          originalAmount: orderAmount,
          discountAmount,
          finalAmount,
          savings: discountAmount
        }
      })
    );
  } catch (error) {
    logger.error('Validate voucher error:', error);
    res.status(500).json(
      errorResponse('Failed to validate voucher')
    );
  }
};

/**
 * Apply voucher (increment usage count)
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const applyVoucher = async (req, res) => {
  try {
    const { code } = req.params;
    
    const voucherIndex = vouchers.findIndex(v => v.code === code);
    if (voucherIndex === -1) {
      return res.status(404).json(
        errorResponse('Voucher not found')
      );
    }
    
    // Increment usage count
    vouchers[voucherIndex].usedCount += 1;
    vouchers[voucherIndex].updatedAt = new Date();
    
    logger.info(`Voucher applied: ${code}`, {
      code,
      usedCount: vouchers[voucherIndex].usedCount,
      usageLimit: vouchers[voucherIndex].usageLimit
    });
    
    res.json(
      successResponse('Voucher applied successfully', {
        code,
        usedCount: vouchers[voucherIndex].usedCount
      })
    );
  } catch (error) {
    logger.error('Apply voucher error:', error);
    res.status(500).json(
      errorResponse('Failed to apply voucher')
    );
  }
};

module.exports = {
  getAllVouchers,
  getVoucherById,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  validateVoucher,
  applyVoucher
};
