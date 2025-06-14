const mongoose = require('mongoose');
const config = require('./config');
const logger = require('../utils/logger');

class Database {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      // Set mongoose options
      mongoose.set('strictQuery', false);
      
      // Connect to MongoDB
      this.connection = await mongoose.connect(config.database.uri, config.database.options);
      
      logger.info('✅ Connected to MongoDB successfully');
      
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
      
      return this.connection;
    } catch (error) {
      logger.error('❌ Failed to connect to MongoDB:', error);
      process.exit(1);
    }
  }

  async disconnect() {
    try {
      if (this.connection) {
        await mongoose.disconnect();
        logger.info('✅ Disconnected from MongoDB');
      }
    } catch (error) {
      logger.error('❌ Error disconnecting from MongoDB:', error);
    }
  }

  getConnection() {
    return this.connection;
  }

  isConnected() {
    return mongoose.connection.readyState === 1;
  }
}

// Create singleton instance
const database = new Database();

module.exports = database;
