const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Generate a random string of specified length
 * @param {number} length - Length of the random string
 * @returns {string} Random string
 */
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate JWT token
 * @param {object} payload - Token payload
 * @param {string} expiresIn - Token expiration time
 * @returns {string} JWT token
 */
const generateToken = (payload, expiresIn = config.jwt.expiresIn) => {
  return jwt.sign(payload, config.jwt.secret, { expiresIn });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {object} Decoded token payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

/**
 * Generate refresh token
 * @param {object} payload - Token payload
 * @returns {string} Refresh token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.jwt.refreshSecret, { 
    expiresIn: config.jwt.refreshExpiresIn 
  });
};

/**
 * Verify refresh token
 * @param {string} token - Refresh token to verify
 * @returns {object} Decoded token payload
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.jwt.refreshSecret);
};

/**
 * Create standardized API response
 * @param {boolean} success - Success status
 * @param {string} message - Response message
 * @param {object} data - Response data
 * @param {object} meta - Additional metadata
 * @returns {object} Standardized response object
 */
const createResponse = (success, message, data = null, meta = {}) => {
  const response = {
    success,
    message,
    timestamp: new Date().toISOString()
  };

  if (data !== null) {
    response.data = data;
  }

  if (Object.keys(meta).length > 0) {
    response.meta = meta;
  }

  return response;
};

/**
 * Create success response
 * @param {string} message - Success message
 * @param {object} data - Response data
 * @param {object} meta - Additional metadata
 * @returns {object} Success response
 */
const successResponse = (message, data = null, meta = {}) => {
  return createResponse(true, message, data, meta);
};

/**
 * Create error response
 * @param {string} message - Error message
 * @param {object} data - Error data
 * @param {object} meta - Additional metadata
 * @returns {object} Error response
 */
const errorResponse = (message, data = null, meta = {}) => {
  return createResponse(false, message, data, meta);
};

/**
 * Paginate results
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} total - Total number of items
 * @returns {object} Pagination metadata
 */
const getPaginationMeta = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? page + 1 : null,
      prevPage: hasPrevPage ? page - 1 : null
    }
  };
};

/**
 * Validate pagination parameters
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {object} Validated pagination parameters
 */
const validatePagination = (page = 1, limit = config.pagination.defaultLimit) => {
  const validatedPage = Math.max(1, parseInt(page) || 1);
  const validatedLimit = Math.min(
    config.pagination.maxLimit,
    Math.max(1, parseInt(limit) || config.pagination.defaultLimit)
  );

  return {
    page: validatedPage,
    limit: validatedLimit,
    skip: (validatedPage - 1) * validatedLimit
  };
};

/**
 * Sanitize user input by removing potentially dangerous characters
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Generate voucher code
 * @param {string} prefix - Voucher prefix
 * @param {number} length - Code length
 * @returns {string} Generated voucher code
 */
const generateVoucherCode = (prefix = 'VCH', length = 8) => {
  const timestamp = Date.now().toString().slice(-6);
  const random = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @returns {string} Formatted currency string
 */
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

/**
 * Calculate discount amount
 * @param {number} originalPrice - Original price
 * @param {number} discountPercent - Discount percentage
 * @returns {object} Discount calculation result
 */
const calculateDiscount = (originalPrice, discountPercent) => {
  const discountAmount = (originalPrice * discountPercent) / 100;
  const finalPrice = originalPrice - discountAmount;
  
  return {
    originalPrice,
    discountPercent,
    discountAmount,
    finalPrice,
    savings: discountAmount
  };
};

module.exports = {
  generateRandomString,
  generateToken,
  verifyToken,
  generateRefreshToken,
  verifyRefreshToken,
  createResponse,
  successResponse,
  errorResponse,
  getPaginationMeta,
  validatePagination,
  sanitizeInput,
  generateVoucherCode,
  formatCurrency,
  calculateDiscount
};
