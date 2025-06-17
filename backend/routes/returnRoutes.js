const express = require('express');
const router = express.Router();
const returnController = require('../controllers/returnController');
const auth = require('../middleware/auth');

// Test route (no auth required)
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Return routes working!' });
});

// Purchase Return routes
router.get('/purchase-returns', auth, returnController.getPurchaseReturns);
router.post('/purchase-returns', auth, returnController.createPurchaseReturn);
router.get('/purchase-returns/:id', auth, returnController.getPurchaseReturnById);
router.put('/purchase-returns/:id', auth, returnController.updatePurchaseReturn);
router.delete('/purchase-returns/:id', auth, returnController.deletePurchaseReturn);

// Sales Return routes
router.get('/sales-returns', auth, returnController.getSalesReturns);
router.post('/sales-returns', auth, returnController.createSalesReturn);
router.get('/sales-returns/:id', auth, returnController.getSalesReturnById);
router.put('/sales-returns/:id', auth, returnController.updateSalesReturn);
router.delete('/sales-returns/:id', auth, returnController.deleteSalesReturn);

module.exports = router;
