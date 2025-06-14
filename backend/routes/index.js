const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const voucherRoutes = require("./voucherRoutes");
const inventoryRoutes = require("./inventoryRoutes");

router.use("/users", userRoutes);
router.use("/vouchers", voucherRoutes);
router.use("/inventory", inventoryRoutes);

module.exports = router;
