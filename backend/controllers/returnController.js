const mongoose = require('mongoose');
const { 
  successResponse, 
  errorResponse, 
  validatePagination, 
  getPaginationMeta
} = require('../utils/helpers');
const logger = require('../utils/logger');
const Voucher = require('../models/voucher');

/**
 * Get purchase returns
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const getPurchaseReturns = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { page: validatedPage, limit: validatedLimit, skip } = validatePagination(page, limit);

    const purchaseReturns = await Voucher.find({ type: 'purchaseReturn' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(validatedLimit);

    const total = await Voucher.countDocuments({ type: 'purchaseReturn' });

    const formattedReturns = purchaseReturns.map(returnItem => ({
      id: returnItem.voucherId,
      _id: returnItem._id,
      date: returnItem.date,
      description: returnItem.description || `Return - ${returnItem.entries} entries`,
      numberOfEntries: returnItem.entries,
      status: returnItem.status || 'Submitted',
      createdAt: returnItem.createdAt,
      updatedAt: returnItem.updatedAt
    }));

    const paginationMeta = getPaginationMeta(validatedPage, validatedLimit, total);

    res.json(
      successResponse('Purchase returns retrieved successfully', {
        items: formattedReturns,
        total: total,
        page: validatedPage,
        limit: validatedLimit
      }, paginationMeta)
    );
  } catch (error) {
    logger.error('Get purchase returns error:', error);
    res.status(500).json(
      errorResponse('Failed to retrieve purchase returns')
    );
  }
};

/**
 * Create purchase return
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const createPurchaseReturn = async (req, res) => {
  try {
    const { date, numberOfEntries, description } = req.body;

    // Validate required fields
    if (!date || !numberOfEntries || !description) {
      return res.status(400).json(
        errorResponse('Missing required fields: date, numberOfEntries, and description are required')
      );
    }

    // Generate return ID
    const count = await Voucher.countDocuments({ type: 'purchaseReturn' });
    const returnId = `PR ${(count + 1).toString().padStart(3, '0')}`;

    // Create purchase return
    const purchaseReturn = new Voucher({
      type: 'purchaseReturn',
      voucherId: returnId,
      date,
      description,
      entries: numberOfEntries,
      total: 0, // Returns don't have monetary total
      createdBy: req.user?.id || null
    });

    await purchaseReturn.save();

    res.status(201).json(
      successResponse('Purchase return created successfully', {
        id: purchaseReturn.voucherId,
        date: purchaseReturn.date,
        description: purchaseReturn.description,
        numberOfEntries: purchaseReturn.entries
      })
    );
  } catch (error) {
    logger.error('Create purchase return error:', error);
    res.status(500).json(
      errorResponse('Failed to create purchase return')
    );
  }
};

/**
 * Get purchase return by ID
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const getPurchaseReturnById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const purchaseReturn = await Voucher.findOne({ 
      $or: [
        { voucherId: id },
        { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }
      ],
      type: 'purchaseReturn'
    });
    
    if (!purchaseReturn) {
      return res.status(404).json(
        errorResponse('Purchase return not found')
      );
    }
    
    res.json(
      successResponse('Purchase return retrieved successfully', {
        id: purchaseReturn.voucherId,
        _id: purchaseReturn._id,
        date: purchaseReturn.date,
        description: purchaseReturn.description,
        numberOfEntries: purchaseReturn.entries,
        status: purchaseReturn.status,
        createdAt: purchaseReturn.createdAt,
        updatedAt: purchaseReturn.updatedAt
      })
    );
  } catch (error) {
    logger.error('Get purchase return by ID error:', error);
    res.status(500).json(
      errorResponse('Failed to retrieve purchase return')
    );
  }
};

/**
 * Update purchase return
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const updatePurchaseReturn = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const purchaseReturn = await Voucher.findOneAndUpdate(
      { 
        $or: [
          { voucherId: id },
          { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }
        ],
        type: 'purchaseReturn'
      },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
    
    if (!purchaseReturn) {
      return res.status(404).json(
        errorResponse('Purchase return not found')
      );
    }
    
    res.json(
      successResponse('Purchase return updated successfully', {
        id: purchaseReturn.voucherId,
        date: purchaseReturn.date,
        description: purchaseReturn.description,
        numberOfEntries: purchaseReturn.entries,
        status: purchaseReturn.status
      })
    );
  } catch (error) {
    logger.error('Update purchase return error:', error);
    res.status(500).json(
      errorResponse('Failed to update purchase return')
    );
  }
};

/**
 * Delete/Void purchase return
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const deletePurchaseReturn = async (req, res) => {
  try {
    const { id } = req.params;
    
    const purchaseReturn = await Voucher.findOneAndUpdate(
      { 
        $or: [
          { voucherId: id },
          { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }
        ],
        type: 'purchaseReturn'
      },
      { status: 'Voided', updatedAt: new Date() },
      { new: true }
    );
    
    if (!purchaseReturn) {
      return res.status(404).json(
        errorResponse('Purchase return not found')
      );
    }
    
    logger.info(`Purchase return voided: ${id}`, {
      returnId: id,
      voidedBy: req.user.id
    });
    
    res.json(
      successResponse('Purchase return voided successfully')
    );
  } catch (error) {
    logger.error('Delete purchase return error:', error);
    res.status(500).json(
      errorResponse('Failed to void purchase return')
    );
  }
};

// Sales Return functions (similar structure)
const getSalesReturns = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { page: validatedPage, limit: validatedLimit, skip } = validatePagination(page, limit);

    const salesReturns = await Voucher.find({ type: 'salesReturn' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(validatedLimit);

    const total = await Voucher.countDocuments({ type: 'salesReturn' });

    const formattedReturns = salesReturns.map(returnItem => ({
      id: returnItem.voucherId,
      _id: returnItem._id,
      date: returnItem.date,
      description: returnItem.description || `Return - ${returnItem.entries} entries`,
      numberOfEntries: returnItem.entries,
      status: returnItem.status || 'Submitted',
      createdAt: returnItem.createdAt,
      updatedAt: returnItem.updatedAt
    }));

    const paginationMeta = getPaginationMeta(validatedPage, validatedLimit, total);

    res.json(
      successResponse('Sales returns retrieved successfully', {
        items: formattedReturns,
        total: total,
        page: validatedPage,
        limit: validatedLimit
      }, paginationMeta)
    );
  } catch (error) {
    logger.error('Get sales returns error:', error);
    res.status(500).json(
      errorResponse('Failed to retrieve sales returns')
    );
  }
};

const createSalesReturn = async (req, res) => {
  try {
    const { date, numberOfEntries, description } = req.body;

    if (!date || !numberOfEntries || !description) {
      return res.status(400).json(
        errorResponse('Missing required fields: date, numberOfEntries, and description are required')
      );
    }

    const count = await Voucher.countDocuments({ type: 'salesReturn' });
    const returnId = `SR ${(count + 1).toString().padStart(3, '0')}`;

    const salesReturn = new Voucher({
      type: 'salesReturn',
      voucherId: returnId,
      date,
      description,
      entries: numberOfEntries,
      total: 0,
      createdBy: req.user?.id || null
    });

    await salesReturn.save();

    res.status(201).json(
      successResponse('Sales return created successfully', {
        id: salesReturn.voucherId,
        date: salesReturn.date,
        description: salesReturn.description,
        numberOfEntries: salesReturn.entries
      })
    );
  } catch (error) {
    logger.error('Create sales return error:', error);
    res.status(500).json(
      errorResponse('Failed to create sales return')
    );
  }
};

const getSalesReturnById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const salesReturn = await Voucher.findOne({ 
      $or: [
        { voucherId: id },
        { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }
      ],
      type: 'salesReturn'
    });
    
    if (!salesReturn) {
      return res.status(404).json(
        errorResponse('Sales return not found')
      );
    }
    
    res.json(
      successResponse('Sales return retrieved successfully', {
        id: salesReturn.voucherId,
        _id: salesReturn._id,
        date: salesReturn.date,
        description: salesReturn.description,
        numberOfEntries: salesReturn.entries,
        status: salesReturn.status,
        createdAt: salesReturn.createdAt,
        updatedAt: salesReturn.updatedAt
      })
    );
  } catch (error) {
    logger.error('Get sales return by ID error:', error);
    res.status(500).json(
      errorResponse('Failed to retrieve sales return')
    );
  }
};

const updateSalesReturn = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const salesReturn = await Voucher.findOneAndUpdate(
      { 
        $or: [
          { voucherId: id },
          { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }
        ],
        type: 'salesReturn'
      },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
    
    if (!salesReturn) {
      return res.status(404).json(
        errorResponse('Sales return not found')
      );
    }
    
    res.json(
      successResponse('Sales return updated successfully', {
        id: salesReturn.voucherId,
        date: salesReturn.date,
        description: salesReturn.description,
        numberOfEntries: salesReturn.entries,
        status: salesReturn.status
      })
    );
  } catch (error) {
    logger.error('Update sales return error:', error);
    res.status(500).json(
      errorResponse('Failed to update sales return')
    );
  }
};

const deleteSalesReturn = async (req, res) => {
  try {
    const { id } = req.params;
    
    const salesReturn = await Voucher.findOneAndUpdate(
      { 
        $or: [
          { voucherId: id },
          { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }
        ],
        type: 'salesReturn'
      },
      { status: 'Voided', updatedAt: new Date() },
      { new: true }
    );
    
    if (!salesReturn) {
      return res.status(404).json(
        errorResponse('Sales return not found')
      );
    }
    
    logger.info(`Sales return voided: ${id}`, {
      returnId: id,
      voidedBy: req.user.id
    });
    
    res.json(
      successResponse('Sales return voided successfully')
    );
  } catch (error) {
    logger.error('Delete sales return error:', error);
    res.status(500).json(
      errorResponse('Failed to void sales return')
    );
  }
};

module.exports = {
  getPurchaseReturns,
  createPurchaseReturn,
  getPurchaseReturnById,
  updatePurchaseReturn,
  deletePurchaseReturn,
  getSalesReturns,
  createSalesReturn,
  getSalesReturnById,
  updateSalesReturn,
  deleteSalesReturn
};
