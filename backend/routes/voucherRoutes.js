const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/voucherController');
const auth = require('../middleware/auth');

// Test route (no auth required)
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Voucher routes working!' });
});

// Specific voucher type routes (MUST come before /:id routes)
router.get('/purchase', auth, voucherController.getPurchaseVouchers);
router.post('/purchase', auth, voucherController.createPurchaseVoucher);
router.get('/sales', auth, voucherController.getSalesVouchers);
router.post('/sales', auth, voucherController.createSalesVoucher);

// General voucher routes (/:id routes MUST come last)
router.get('/', auth, voucherController.getAllVouchers);
router.post('/', auth, voucherController.createVoucher);
router.get('/:id', auth, voucherController.getVoucherById);
router.put('/:id', auth, voucherController.updateVoucher);
router.delete('/:id', auth, voucherController.deleteVoucher);

module.exports = router;
