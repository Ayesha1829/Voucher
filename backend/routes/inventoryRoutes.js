const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');

// Validation middleware for inventory item creation
const validateInventoryItem = [
  body('itemName')
    .trim()
    .notEmpty()
    .withMessage('Item name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Item name must be between 2 and 100 characters'),
  body('itemCode')
    .trim()
    .notEmpty()
    .withMessage('Item code is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Item code must be between 2 and 50 characters'),
  body('qty')
    .isNumeric()
    .withMessage('Quantity must be a number')
    .isFloat({ min: 0 })
    .withMessage('Quantity must be 0 or greater'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isMongoId()
    .withMessage('Category must be a valid ID'),
  body('unit')
    .trim()
    .notEmpty()
    .withMessage('Unit is required'),
  body('rate')
    .isNumeric()
    .withMessage('Rate must be a number')
    .isFloat({ min: 0 })
    .withMessage('Rate must be 0 or greater')
];

// Test route (no auth required for testing)
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Inventory routes working!' });
});

// Public routes (for dropdown population, etc.)
router.get('/', inventoryController.getAllItems);
router.get('/stats', inventoryController.getInventoryStats);
router.get('/low-stock', inventoryController.getLowStockItems);
router.get('/:id', inventoryController.getItemById);

// Protected routes (require authentication)
router.post('/', auth, validateInventoryItem, inventoryController.createItem);
router.post('/bulk', auth, inventoryController.createMultipleItems);
router.put('/:id', auth, inventoryController.updateItem);
router.put('/:id/stock', auth, inventoryController.updateStock);
router.delete('/:id', auth, inventoryController.deleteItem);

module.exports = router;
