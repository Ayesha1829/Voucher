const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const config = require('../config/config');
const { ApiError } = require('../middleware/errorHandler');
const { successResponse, errorResponse, generateToken, generateRefreshToken } = require('../utils/helpers');
const logger = require('../utils/logger');
const User = require('../models/user');

/**
 * Register a new user
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(
        errorResponse('Validation failed', errors.array())
      );
    }

    const { email, password, name, role = 'user' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json(
        errorResponse('User with this email already exists')
      );
    }

    // Hash password
    const saltRounds = config.security.bcryptRounds;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({ email, password: hashedPassword, username: name, role });
    await newUser.save();

    // Generate tokens
    const tokenPayload = {
      id: newUser._id,
      email: newUser.email,
      role: newUser.role
    };

    const accessToken = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Remove password from response
    const { password: _, ...userResponse } = newUser.toObject();

    logger.info(`New user registered: ${email}`, {
      userId: newUser._id,
      email,
      role
    });

    res.status(201).json(
      successResponse('User registered successfully', {
        user: userResponse,
        tokens: {
          accessToken,
          refreshToken
        }
      })
    );
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json(
      errorResponse('Registration failed')
    );
  }
};

/**
 * Login user
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const login = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(
        errorResponse('Validation failed', errors.array())
      );
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json(
        errorResponse('Invalid email or password')
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json(
        errorResponse('Account is deactivated')
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn(`Failed login attempt for email: ${email}`, {
        email,
        ip: req.ip
      });
      
      return res.status(401).json(
        errorResponse('Invalid email or password')
      );
    }

    // Generate tokens
    const tokenPayload = {
      id: user._id,
      email: user.email,
      role: user.role
    };

    const accessToken = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Remove password from response
    const { password: _, ...userResponse } = user.toObject();

    logger.info(`User logged in: ${email}`, {
      userId: user._id,
      email,
      ip: req.ip
    });

    res.json(
      successResponse('Login successful', {
        user: userResponse,
        tokens: {
          accessToken,
          refreshToken
        }
      })
    );
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json(
      errorResponse('Login failed')
    );
  }
};

/**
 * Refresh access token
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json(
        errorResponse('Refresh token is required')
      );
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);

    // Find user
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json(
        errorResponse('Invalid refresh token')
      );
    }

    // Generate new access token
    const tokenPayload = {
      id: user._id,
      email: user.email,
      role: user.role
    };

    const newAccessToken = generateToken(tokenPayload);

    res.json(
      successResponse('Token refreshed successfully', {
        accessToken: newAccessToken
      })
    );
  } catch (error) {
    logger.error('Token refresh error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json(
        errorResponse('Refresh token has expired')
      );
    }
    
    res.status(401).json(
      errorResponse('Invalid refresh token')
    );
  }
};

/**
 * Get current user profile
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json(
        errorResponse('User not found')
      );
    }

    res.json(
      successResponse('Profile retrieved successfully', user)
    );
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json(
      errorResponse('Failed to retrieve profile')
    );
  }
};

/**
 * Update user profile
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(
        errorResponse('User not found')
      );
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: userId } });
      if (emailExists) {
        return res.status(409).json(
          errorResponse('Email is already taken')
        );
      }
    }

    // Update user
    if (name) user.username = name;
    if (email) user.email = email;
    user.updatedAt = new Date();

    await user.save();

    // Remove password from response
    const { password: _, ...userResponse } = user.toObject();

    logger.info(`User profile updated: ${userId}`, {
      userId,
      changes: { name, email }
    });

    res.json(
      successResponse('Profile updated successfully', userResponse)
    );
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json(
      errorResponse('Failed to update profile')
    );
  }
};

/**
 * Change user password
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(
        errorResponse('User not found')
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json(
        errorResponse('Current password is incorrect')
      );
    }

    // Hash new password
    const saltRounds = config.security.bcryptRounds;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    user.password = hashedNewPassword;
    user.updatedAt = new Date();

    await user.save();

    logger.info(`Password changed for user: ${userId}`, {
      userId
    });

    res.json(
      successResponse('Password changed successfully')
    );
  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json(
      errorResponse('Failed to change password')
    );
  }
};

/**
 * Logout user (in a real app, you might want to blacklist the token)
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const logout = async (req, res) => {
  try {
    logger.info(`User logged out: ${req.user.id}`, {
      userId: req.user.id
    });

    res.json(
      successResponse('Logout successful')
    );
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json(
      errorResponse('Logout failed')
    );
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  getProfile,
  updateProfile,
  changePassword,
  logout
};
