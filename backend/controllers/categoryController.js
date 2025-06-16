const Category = require('../models/category');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

// Helper functions for consistent responses
const successResponse = (message, data = null) => ({
  success: true,
  message,
  data
});

const errorResponse = (message, errors = null) => ({
  success: false,
  message,
  errors
});

/**
 * Get all categories
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const getAllCategories = async (req, res) => {
  try {
    const { active } = req.query;
    
    // Build filter
    const filter = {};
    if (active !== undefined) {
      filter.isActive = active === 'true';
    }
    
    const categories = await Category.find(filter)
      .populate('createdBy', 'name email')
      .sort({ name: 1 });
    
    logger.info(`Retrieved ${categories.length} categories`);
    
    res.json(
      successResponse('Categories retrieved successfully', categories)
    );
  } catch (error) {
    logger.error('Get all categories error:', error);
    res.status(500).json(
      errorResponse('Failed to retrieve categories')
    );
  }
};

/**
 * Get category by ID
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findById(id)
      .populate('createdBy', 'name email');
    
    if (!category) {
      return res.status(404).json(
        errorResponse('Category not found')
      );
    }
    
    logger.info(`Retrieved category: ${id}`, {
      categoryId: id,
      name: category.name
    });
    
    res.json(
      successResponse('Category retrieved successfully', category)
    );
  } catch (error) {
    logger.error('Get category by ID error:', error);
    res.status(500).json(
      errorResponse('Failed to retrieve category')
    );
  }
};

/**
 * Create new category
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const createCategory = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(
        errorResponse('Validation failed', errors.array())
      );
    }
    
    const { name, description } = req.body;
    
    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
    
    if (existingCategory) {
      return res.status(409).json(
        errorResponse('Category already exists')
      );
    }
    
    // Create new category
    const newCategory = new Category({
      name: name.trim(),
      description: description?.trim() || '',
      createdBy: req.user?.id
    });
    
    await newCategory.save();
    
    // Populate the createdBy field for response
    await newCategory.populate('createdBy', 'name email');
    
    logger.info(`New category created: ${name}`, {
      categoryId: newCategory._id,
      name,
      createdBy: req.user?.id
    });
    
    res.status(201).json(
      successResponse('Category created successfully', newCategory)
    );
  } catch (error) {
    logger.error('Create category error:', error);
    res.status(500).json(
      errorResponse('Failed to create category')
    );
  }
};

/**
 * Update category
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(
        errorResponse('Validation failed', errors.array())
      );
    }
    
    const { name, description, isActive } = req.body;
    
    // Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json(
        errorResponse('Category not found')
      );
    }
    
    // Check if name already exists (excluding current category)
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: id }
      });
      
      if (existingCategory) {
        return res.status(409).json(
          errorResponse('Category name already exists')
        );
      }
    }
    
    // Update category
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (isActive !== undefined) updateData.isActive = isActive;
    updateData.updatedAt = new Date();
    
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');
    
    logger.info(`Category updated: ${id}`, {
      categoryId: id,
      name: updatedCategory.name,
      updatedBy: req.user?.id
    });
    
    res.json(
      successResponse('Category updated successfully', updatedCategory)
    );
  } catch (error) {
    logger.error('Update category error:', error);
    res.status(500).json(
      errorResponse('Failed to update category')
    );
  }
};

/**
 * Delete category
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json(
        errorResponse('Category not found')
      );
    }
    
    await Category.findByIdAndDelete(id);
    
    logger.info(`Category deleted: ${id}`, {
      categoryId: id,
      name: category.name,
      deletedBy: req.user?.id
    });
    
    res.json(
      successResponse('Category deleted successfully')
    );
  } catch (error) {
    logger.error('Delete category error:', error);
    res.status(500).json(
      errorResponse('Failed to delete category')
    );
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
