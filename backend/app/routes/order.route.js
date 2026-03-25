const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order.controller");
const auth = require("../middlewares/auth.middleware");
const isAdmin = require("../middlewares/admin.middleware");

// 📦 USER
router.post("/checkout", auth, orderController.checkout);
router.get("/my-orders", auth, orderController.getMyOrders);
router.get("/:id", auth, orderController.getOrderById);
router.put("/received/:id", auth, orderController.confirmReceived);

// ❌ hủy đơn
router.put("/cancel/:id", auth, orderController.cancelOrder);

// 📦 ADMIN
router.get("/", auth, isAdmin, orderController.getAllOrders);
router.put("/confirm/:id", auth, isAdmin, orderController.confirmOrder);
router.put("/shipping/:id", auth, isAdmin, orderController.confirmShipping);

module.exports = router;