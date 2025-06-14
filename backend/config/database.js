const mongoose = require('mongoose');
const config = require('./config');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    // Set mongoose options
    mongoose.set('strictQuery', false);
    
    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/voucher_db');
    
    logger.info(`✅ Connected to MongoDB: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      logger.info('🔄 MongoDB reconnected');
    });
    
    return conn;
  } catch (error) {
    logger.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
