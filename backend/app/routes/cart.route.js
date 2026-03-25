const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

// Lấy giỏ hàng: GET /api/cart/:userId
router.get("/:userId", cartController.getCart);

// Thêm vào giỏ: POST /api/cart
router.post("/", cartController.addToCart);

// Cập nhật số lượng: PUT /api/cart
router.put("/", cartController.updateCartItem);

// Xóa 1 sản phẩm: DELETE /api/cart/:userId/:productId
router.delete("/:userId/:productId", cartController.removeFromCart);

module.exports = router;