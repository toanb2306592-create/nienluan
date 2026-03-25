const express = require("express");
const router = express.Router();
const controller = require("../controllers/review.controller");

// Lấy review (Không cần login)
router.get("/product/:productId", controller.getReviewsByProduct);
router.get("/average/:productId", controller.getAverageRating);

// Viết review (Bạn có thể thêm middleware verifyToken vào đây sau)
router.post("/", controller.createReview);

module.exports = router;