const Review = require("../models/review.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const mongoose = require("mongoose");

// ⭐ Tạo review (Lưu ý: Đang để req.body.userId để bạn test không cần Token)
exports.createReview = async (req, res) => {
    try {
        const { productId, rating, comment, orderId, userId, userName } = req.body;

        // 1. Kiểm tra đơn hàng đã xong chưa
        const order = await Order.findOne({
            _id: orderId,
            userId: userId,
            status: "completed"
        });

        if (!order) {
            return res.status(400).json({ message: "Bạn chưa mua hoặc đơn hàng chưa hoàn thành" });
        }

        // 2. Kiểm tra sản phẩm có trong đơn hàng không
        const hasProduct = order.items.some(item => item.productId.toString() === productId);
        if (!hasProduct) {
            return res.status(400).json({ message: "Sản phẩm không có trong đơn này" });
        }

        const product = await Product.findById(productId);

        const review = new Review({
            user: userId,
            product: productId,
            order: orderId,
            userName: userName || "Người dùng",
            productName: product.productName,
            rating,
            comment
        });

        await review.save();
        res.status(201).json({ message: "Đánh giá thành công", review });

    } catch (error) {
        res.status(500).json({ message: "Lỗi tạo review", error: error.message });
    }
};

// ⭐ Lấy danh sách review của 1 sản phẩm (Fix tên hàm cho khớp Route)
exports.getReviewsByProduct = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ⭐ Tính rating trung bình (Dùng cho trang chủ/danh sách SP)
exports.getAverageRating = async (req, res) => {
    try {
        const result = await Review.aggregate([
            { $match: { product: new mongoose.Types.ObjectId(req.params.productId) } },
            {
                $group: {
                    _id: "$product",
                    avgRating: { $avg: "$rating" },
                    total: { $sum: 1 }
                }
            }
        ]);
        res.json(result[0] || { avgRating: 0, total: 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};