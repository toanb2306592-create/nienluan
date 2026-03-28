const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");


router.post("/", reviewController.createReview);

router.get("/product/:productId", reviewController.getReviewsByProduct);

router.get("/average/:productId", reviewController.getAverageRating);

module.exports = router;