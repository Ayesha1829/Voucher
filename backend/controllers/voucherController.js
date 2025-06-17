const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
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

    // First try to find in MongoDB (for purchase/sales vouchers)
    const mongoVoucher = await Voucher.findOne({
      $or: [
        { voucherId: id },
        { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }
      ]
    });

    if (mongoVoucher) {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(
          errorResponse('Validation failed', errors.array())
        );
      }

      const updateData = req.body;

      // Update MongoDB voucher
      const updatedVoucher = await Voucher.findByIdAndUpdate(
        mongoVoucher._id,
        {
          ...updateData,
          updatedAt: new Date()
        },
        { new: true }
      );

      logger.info(`MongoDB voucher updated: ${id}`, {
        voucherId: id,
        type: mongoVoucher.type,
        updatedBy: req.user.id,
        changes: Object.keys(updateData)
      });

      return res.json(
        successResponse('Voucher updated successfully', updatedVoucher)
      );
    }

    // Fallback to in-memory vouchers (for old voucher system)
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

    // Update in-memory voucher
    vouchers[voucherIndex] = {
      ...vouchers[voucherIndex],
      ...updateData,
      updatedAt: new Date()
    };

    logger.info(`In-memory voucher updated: ${id}`, {
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

    // First try to find in MongoDB (for purchase/sales vouchers)
    const mongoVoucher = await Voucher.findOne({
      $or: [
        { voucherId: id },
        { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }
      ]
    });

    if (mongoVoucher) {
      // Instead of deleting, set status to 'Voided'
      await Voucher.findByIdAndUpdate(mongoVoucher._id, {
        status: 'Voided',
        updatedAt: new Date()
      });

      logger.info(`MongoDB voucher voided: ${id}`, {
        voucherId: id,
        type: mongoVoucher.type,
        voidedBy: req.user.id
      });

      return res.json(
        successResponse('Voucher voided successfully')
      );
    }

    // Fallback to in-memory vouchers (for old voucher system)
    const voucherIndex = vouchers.findIndex(v => v.id === id);
    if (voucherIndex === -1) {
      return res.status(404).json(
        errorResponse('Voucher not found')
      );
    }

    const deletedVoucher = vouchers.splice(voucherIndex, 1)[0];

    logger.info(`In-memory voucher deleted: ${id}`, {
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

/**
 * Get purchase vouchers
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const getPurchaseVouchers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { page: validatedPage, limit: validatedLimit, skip } = validatePagination(page, limit);

    // Find purchase vouchers from database
    const purchaseVouchers = await Voucher.find({ type: 'purchase' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(validatedLimit);

    const total = await Voucher.countDocuments({ type: 'purchase' });

    // Format vouchers for frontend
    const formattedVouchers = purchaseVouchers.map(voucher => ({
      id: voucher.voucherId,
      _id: voucher._id,
      prvId: voucher.voucherId,
      date: voucher.date,
      dated: voucher.date,
      description: `${voucher.items.length} items - Total: ${voucher.total}`,
      items: voucher.items.map(item => ({
        itemName: item.itemName,
        quantity: item.quantity,
        rate: item.rate
      })),
      entries: voucher.entries,
      status: voucher.status || 'Submitted',
      createdAt: voucher.createdAt,
      updatedAt: voucher.updatedAt
    }));

    const paginationMeta = getPaginationMeta(validatedPage, validatedLimit, total);

    res.json(
      successResponse(
        'Purchase vouchers retrieved successfully',
        {
          vouchers: formattedVouchers,
          total: total,
          page: validatedPage,
          limit: validatedLimit
        },
        paginationMeta
      )
    );
  } catch (error) {
    logger.error('Get purchase vouchers error:', error);
    res.status(500).json(
      errorResponse('Failed to retrieve purchase vouchers')
    );
  }
};

/**
 * Create purchase voucher
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const createPurchaseVoucher = async (req, res) => {
  try {
    const { date, supplier, items } = req.body;

    // Validate required fields
    if (!date || !supplier || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json(
        errorResponse('Missing required fields: date, supplier, and items are required')
      );
    }

    // Generate voucher ID
    const count = await Voucher.countDocuments({ type: 'purchase' });
    const voucherId = `PV ${(count + 1).toString().padStart(3, '0')}`;

    // Calculate total and entries
    const total = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const entries = items.length;

    // Create voucher
    const voucher = new Voucher({
      type: 'purchase',
      voucherId,
      date,
      items,
      supplier,
      total,
      entries,
      createdBy: req.user?.id || null
    });

    await voucher.save();

    res.status(201).json(
      successResponse('Purchase voucher created successfully', {
        id: voucher.voucherId,
        date: voucher.date,
        items: voucher.items,
        entries: voucher.entries,
        total: voucher.total
      })
    );
  } catch (error) {
    logger.error('Create purchase voucher error:', error);
    res.status(500).json(
      errorResponse('Failed to create purchase voucher')
    );
  }
};

/**
 * Get sales vouchers
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const getSalesVouchers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { page: validatedPage, limit: validatedLimit, skip } = validatePagination(page, limit);

    const salesVouchers = await Voucher.find({ type: 'sales' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(validatedLimit);

    const total = await Voucher.countDocuments({ type: 'sales' });

    const formattedVouchers = salesVouchers.map(voucher => ({
      id: voucher.voucherId,
      _id: voucher._id,
      date: voucher.date,
      dated: voucher.date,
      description: `${voucher.items.length} items - Total: ${voucher.total}`,
      items: voucher.items,
      entries: voucher.entries,
      status: voucher.status || 'Submitted',
      createdAt: voucher.createdAt,
      updatedAt: voucher.updatedAt
    }));

    const paginationMeta = getPaginationMeta(validatedPage, validatedLimit, total);

    res.json(
      successResponse('Sales vouchers retrieved successfully', {
        vouchers: formattedVouchers,
        total: total,
        page: validatedPage,
        limit: validatedLimit
      }, paginationMeta)
    );
  } catch (error) {
    logger.error('Get sales vouchers error:', error);
    res.status(500).json(
      errorResponse('Failed to retrieve sales vouchers')
    );
  }
};

/**
 * Create sales voucher
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const createSalesVoucher = async (req, res) => {
  try {
    const { date, party, items } = req.body;

    const count = await Voucher.countDocuments({ type: 'sales' });
    const voucherId = `SV ${(count + 1).toString().padStart(3, '0')}`;

    const total = items.reduce((sum, item) => sum + item.total, 0);
    const entries = items.length;

    const voucher = new Voucher({
      type: 'sales',
      voucherId,
      date,
      items,
      party,
      total,
      entries,
      createdBy: req.user?.id || null
    });

    await voucher.save();

    res.status(201).json(
      successResponse('Sales voucher created successfully', {
        id: voucher.voucherId,
        date: voucher.date,
        items: voucher.items,
        entries: voucher.entries,
        total: voucher.total
      })
    );
  } catch (error) {
    logger.error('Create sales voucher error:', error);
    res.status(500).json(
      errorResponse('Failed to create sales voucher')
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
  applyVoucher,
  getPurchaseVouchers,
  createPurchaseVoucher,
  getSalesVouchers,
  createSalesVoucher
};
