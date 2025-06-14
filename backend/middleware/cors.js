const cors = require('cors');
const config = require('../config/config');
const logger = require('../utils/logger');

/**
 * CORS configuration middleware
 */
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = Array.isArray(config.cors.origin) 
      ? config.cors.origin 
      : [config.cors.origin];
    
    // Check if the origin is in the allowed origins list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: config.cors.credentials,
  optionsSuccessStatus: config.cors.optionsSuccessStatus,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-Access-Token'
  ],
  exposedHeaders: [
    'X-Total-Count',
    'X-Page-Count',
    'X-Current-Page',
    'X-Per-Page'
  ],
  maxAge: 86400 // 24 hours
};

/**
 * Development CORS configuration (more permissive)
 */
const devCorsOptions = {
  origin: true, // Allow all origins in development
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-Access-Token'
  ]
};

/**
 * Get CORS middleware based on environment
 */
const getCorsMiddleware = () => {
  if (process.env.NODE_ENV === 'development') {
    logger.info('Using development CORS configuration (permissive)');
    return cors(devCorsOptions);
  } else {
    logger.info('Using production CORS configuration (restrictive)');
    return cors(corsOptions);
  }
};

module.exports = getCorsMiddleware();
