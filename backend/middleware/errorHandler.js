const logger = require('../utils/logger');
const { errorResponse } = require('../utils/helpers');

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle Mongoose validation errors
 * @param {Error} error - Mongoose validation error
 * @returns {object} Formatted error response
 */
const handleValidationError = (error) => {
  const errors = Object.values(error.errors).map(err => ({
    field: err.path,
    message: err.message,
    value: err.value
  }));
  
  return {
    statusCode: 400,
    message: 'Validation Error',
    errors
  };
};

/**
 * Handle Mongoose duplicate key errors
 * @param {Error} error - Mongoose duplicate key error
 * @returns {object} Formatted error response
 */
const handleDuplicateKeyError = (error) => {
  const field = Object.keys(error.keyValue)[0];
  const value = error.keyValue[field];
  
  return {
    statusCode: 409,
    message: `${field} '${value}' already exists`,
    field,
    value
  };
};

/**
 * Handle Mongoose cast errors
 * @param {Error} error - Mongoose cast error
 * @returns {object} Formatted error response
 */
const handleCastError = (error) => {
  return {
    statusCode: 400,
    message: `Invalid ${error.path}: ${error.value}`,
    field: error.path,
    value: error.value
  };
};

/**
 * Handle JWT errors
 * @param {Error} error - JWT error
 * @returns {object} Formatted error response
 */
const handleJWTError = (error) => {
  let message = 'Invalid token';
  
  if (error.name === 'TokenExpiredError') {
    message = 'Token has expired';
  } else if (error.name === 'JsonWebTokenError') {
    message = 'Invalid token format';
  }
  
  return {
    statusCode: 401,
    message
  };
};

/**
 * Handle multer errors (file upload)
 * @param {Error} error - Multer error
 * @returns {object} Formatted error response
 */
const handleMulterError = (error) => {
  let message = 'File upload error';
  let statusCode = 400;
  
  switch (error.code) {
    case 'LIMIT_FILE_SIZE':
      message = 'File size too large';
      break;
    case 'LIMIT_FILE_COUNT':
      message = 'Too many files';
      break;
    case 'LIMIT_UNEXPECTED_FILE':
      message = 'Unexpected file field';
      break;
    case 'LIMIT_PART_COUNT':
      message = 'Too many parts';
      break;
    default:
      message = error.message || 'File upload error';
  }
  
  return {
    statusCode,
    message
  };
};

/**
 * Main error handling middleware
 * @param {Error} err - Error object
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  
  // Log error
  logger.error(`Error ${err.name}: ${err.message}`, {
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    const validationError = handleValidationError(err);
    error.statusCode = validationError.statusCode;
    error.message = validationError.message;
    error.errors = validationError.errors;
  }
  
  if (err.code === 11000) {
    const duplicateError = handleDuplicateKeyError(err);
    error.statusCode = duplicateError.statusCode;
    error.message = duplicateError.message;
  }
  
  if (err.name === 'CastError') {
    const castError = handleCastError(err);
    error.statusCode = castError.statusCode;
    error.message = castError.message;
  }
  
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    const jwtError = handleJWTError(err);
    error.statusCode = jwtError.statusCode;
    error.message = jwtError.message;
  }
  
  if (err.name === 'MulterError') {
    const multerError = handleMulterError(err);
    error.statusCode = multerError.statusCode;
    error.message = multerError.message;
  }
  
  // Default error response
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  
  const response = errorResponse(message);
  
  // Add additional error details in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    response.details = error;
  }
  
  // Add validation errors if present
  if (error.errors) {
    response.errors = error.errors;
  }
  
  res.status(statusCode).json(response);
};

/**
 * Handle 404 errors
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 */
const notFound = (req, res, next) => {
  const error = new ApiError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

/**
 * Async error wrapper
 * @param {function} fn - Async function to wrap
 * @returns {function} Wrapped function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = errorHandler;
