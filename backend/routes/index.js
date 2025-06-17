const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const voucherRoutes = require("./voucherRoutes");
const inventoryRoutes = require("./inventoryRoutes");
const categoryRoutes = require("./categoryRoutes");
const returnRoutes = require("./returnRoutes");

router.use("/users", userRoutes);
router.use("/vouchers", voucherRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/categories", categoryRoutes);
router.use("/", returnRoutes);

module.exports = router;
