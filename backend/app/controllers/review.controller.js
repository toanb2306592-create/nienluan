const Review = require("../models/review.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const mongoose = require("mongoose");

exports.createReview = async (req, res) => {
    try {
        const { productId, rating, comment, orderId, userId, userName } = req.body;

        // 1. Kiểm tra đơn hàng (Nới lỏng trạng thái để dễ test: shipping, delivered, completed)
        const order = await Order.findOne({
            _id: orderId,
            userId: userId,
            status: { $in: ["completed", "delivered", "shipping"] }
        });

        if (!order) {
            return res.status(400).json({ message: "Đơn hàng không hợp lệ hoặc chưa hoàn thành" });
        }

        // 2. So sánh ID sản phẩm (Dùng toString() để chắc chắn khớp kiểu dữ liệu)
        const hasProduct = order.items.some(item => 
            item.productId.toString() === productId.toString()
        );

        if (!hasProduct) {
            return res.status(400).json({ message: "Sản phẩm không có trong đơn này" });
        }

        // 3. Lấy tên sản phẩm thực tế từ DB
        const product = await Product.findById(productId);

        const review = new Review({
            user: userId,
            product: productId,
            order: orderId,
            userName: userName || "Người dùng",
            productName: product ? product.productName : "Sản phẩm",
            rating: Number(rating),
            comment: comment || ""
        });

        await review.save();
        res.status(201).json({ message: "Đánh giá thành công", review });

    } catch (error) {
        res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
    }
};

exports.getReviewsByProduct = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

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