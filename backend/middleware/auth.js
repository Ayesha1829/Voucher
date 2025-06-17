const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { ApiError } = require('./errorHandler');
const { errorResponse } = require('../utils/helpers');
const logger = require('../utils/logger');

/**
 * Extract token from request headers
 * @param {object} req - Express request object
 * @returns {string|null} JWT token or null
 */
const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Also check for token in X-Access-Token header
  if (req.headers['x-access-token']) {
    return req.headers['x-access-token'];
  }
  
  return null;
};

/**
 * Middleware to authenticate JWT tokens
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 */
const authenticate = async (req, res, next) => {
  try {
    const token = extractToken(req);
    
    if (!token) {
      return res.status(401).json(
        errorResponse('Access denied. No token provided.')
      );
    }
    
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Add user info to request object
    req.user = decoded;
    
    logger.debug(`User authenticated: ${decoded.id}`, {
      userId: decoded.id,
      email: decoded.email,
      role: decoded.role
    });
    
    next();
  } catch (error) {
    logger.warn(`Authentication failed: ${error.message}`, {
      token: req.headers.authorization ? 'present' : 'missing',
      ip: req.ip
    });
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json(
        errorResponse('Token has expired. Please login again.')
      );
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json(
        errorResponse('Invalid token format.')
      );
    }
    
    return res.status(401).json(
      errorResponse('Invalid token.')
    );
  }
};

/**
 * Middleware to authorize user roles
 * @param {...string} roles - Allowed roles
 * @returns {function} Express middleware function
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(
        errorResponse('Access denied. User not authenticated.')
      );
    }
    
    if (!roles.includes(req.user.role)) {
      logger.warn(`Authorization failed for user ${req.user.id}`, {
        userId: req.user.id,
        userRole: req.user.role,
        requiredRoles: roles,
        resource: req.originalUrl
      });
      
      return res.status(403).json(
        errorResponse('Access denied. Insufficient permissions.')
      );
    }
    
    logger.debug(`User authorized: ${req.user.id}`, {
      userId: req.user.id,
      role: req.user.role,
      resource: req.originalUrl
    });
    
    next();
  };
};

/**
 * Optional authentication middleware
 * Adds user info to request if token is valid, but doesn't require authentication
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 */
const optionalAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    
    if (token) {
      const decoded = jwt.verify(token, config.jwt.secret);
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    // Ignore authentication errors for optional auth
    next();
  }
};

/**
 * Middleware to check if user owns the resource
 * @param {string} paramName - Parameter name containing the user ID
 * @returns {function} Express middleware function
 */
const checkOwnership = (paramName = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(
        errorResponse('Access denied. User not authenticated.')
      );
    }
    
    const resourceUserId = req.params[paramName];
    
    // Admin can access any resource
    if (req.user.role === 'admin') {
      return next();
    }
    
    // User can only access their own resources
    if (req.user.id !== resourceUserId) {
      logger.warn(`Ownership check failed for user ${req.user.id}`, {
        userId: req.user.id,
        resourceUserId,
        resource: req.originalUrl
      });
      
      return res.status(403).json(
        errorResponse('Access denied. You can only access your own resources.')
      );
    }
    
    next();
  };
};

/**
 * Middleware to validate API key (for external integrations)
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 */
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json(
      errorResponse('API key required.')
    );
  }
  
  // In a real application, you would validate the API key against a database
  const validApiKeys = process.env.VALID_API_KEYS ? 
    process.env.VALID_API_KEYS.split(',') : [];
  
  if (!validApiKeys.includes(apiKey)) {
    logger.warn(`Invalid API key used: ${apiKey}`, {
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    return res.status(401).json(
      errorResponse('Invalid API key.')
    );
  }
  
  next();
};

/**
 * Rate limiting middleware for authentication attempts
 */
const authRateLimit = require('express-rate-limit')({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
    retryAfter: 15 * 60 // 15 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for successful authentications
    return req.user !== undefined;
  }
});

module.exports = authenticate;
