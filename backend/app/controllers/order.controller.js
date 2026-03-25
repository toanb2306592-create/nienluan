const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const Address = require("../models/address.model");
const StatusHistory = require("../models/status_history.model");
const mongoose = require("mongoose");

// 📦 GET ALL (ADMIN)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("userId", "-password")
            .populate("items.productId")
            .populate("addressId")
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy danh sách đơn hàng",
            error: error.message
        });
    }
};

// 📦 GET BY ID
exports.getOrderById = async (req, res) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID không hợp lệ" });
        }

        const order = await Order.findById(id)
            .populate("userId", "-password")
            .populate("items.productId")
            .populate("addressId");

        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy đơn hàng",
            error: error.message
        });
    }
};

// 🔥 CHECKOUT (Đã bỏ Transaction để tương thích máy cá nhân)
exports.checkout = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { addressId, selectedItems } = req.body;

        if (!selectedItems || selectedItems.length === 0) {
            return res.status(400).json({ message: "Chưa chọn sản phẩm" });
        }

        const address = await Address.findOne({ _id: addressId, userId });
        if (!address) {
            return res.status(404).json({ message: "Địa chỉ không hợp lệ hoặc đã bị xóa" });
        }

        let totalAmount = 0;
        let orderItems = [];

        // Kiểm tra tồn kho và chuẩn bị dữ liệu
        for (let item of selectedItems) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({ message: `Sản phẩm ${item.productId} không tồn tại` });
            }

            // Lưu ý: Sử dụng product.quantity hoặc product.stock tùy theo Model của bạn
            // Ở đây mình giữ theo logic req.body của bạn là .quantity
            if (product.quantity < item.quantity) {
                return res.status(400).json({ message: `Sản phẩm ${product.productName} không đủ hàng` });
            }

            totalAmount += product.price * item.quantity;

            orderItems.push({
                productId: product._id,
                productName: product.productName,
                price: product.price,
                quantity: item.quantity,
                image: product.image
            });

            // TRỪ KHO
            product.quantity -= item.quantity;
            await product.save();
        }

        const order = new Order({
            userId,
            addressId,
            shippingAddress: {
                fullName: address.fullName,
                phone: address.phone,
                address: address.address
            },
            items: orderItems,
            totalAmount,
            status: "pending",
            paymentStatus: "unpaid"
        });

        const savedOrder = await order.save();

        // Tạo lịch sử trạng thái
        await StatusHistory.create({
            order: savedOrder._id,
            status: "pending",
            changedBy: userId,
            role: "user"
        });

        // Xóa sản phẩm đã chọn khỏi giỏ hàng
        await Cart.updateOne(
            { userId },
            {
                $pull: {
                    items: {
                        productId: { $in: selectedItems.map(i => i.productId) }
                    }
                }
            }
        );

        res.status(201).json({
            message: "Đặt hàng thành công",
            order: savedOrder
        });

    } catch (error) {
        console.error("Checkout error:", error);
        res.status(500).json({
            message: "Lỗi khi checkout",
            error: error.message
        });
    }
};

// ✅ ADMIN duyệt đơn
exports.confirmOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        if (order.status !== "pending") return res.status(400).json({ message: "Chỉ duyệt đơn pending" });

        order.status = "confirmed";
        order.confirmedAt = new Date();
        await order.save();

        await StatusHistory.create({
            order: order._id,
            status: "confirmed",
            changedBy: req.user.id,
            role: "admin"
        });

        res.json({ message: "Đã duyệt đơn", order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 🚚 ADMIN giao hàng
exports.confirmShipping = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        if (order.status !== "confirmed") return res.status(400).json({ message: "Chưa duyệt đơn" });

        const now = new Date();
        const deliveryDate = new Date();
        deliveryDate.setDate(now.getDate() + 1);

        order.status = "shipping";
        order.shippingAt = now;
        order.deliveryDate = deliveryDate;

        await order.save();

        await StatusHistory.create({
            order: order._id,
            status: "shipping",
            changedBy: req.user.id,
            role: "admin"
        });

        res.json({ message: "Đang giao", order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 📦 USER nhận hàng
// Cập nhật hàm confirmReceived trong order.controller.js
exports.confirmReceived = async (req, res) => {
    try {
        // Tìm đơn hàng của đúng user đang đăng nhập và đang ở trạng thái shipping
        const order = await Order.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng hoặc đơn không thuộc về bạn" });
        if (order.status !== "shipping") return res.status(400).json({ message: "Đơn hàng chưa ở trạng thái đang giao" });

        order.status = "completed";
        order.receivedAt = new Date();
        order.paymentStatus = "paid"; // Thường nhận hàng xong sẽ chuyển thành đã thanh toán (nếu là COD)
        await order.save();

        // Ghi lại lịch sử
        await StatusHistory.create({
            order: order._id,
            status: "completed",
            changedBy: req.user.id,
            role: "user"
        });

        res.json({ message: "Xác nhận đã nhận hàng thành công", order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ❌ HỦY ĐƠN (CÓ TRẢ KHO - Đã bỏ Transaction)
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!order) return res.status(404).json({ message: "Không tìm thấy đơn" });
        if (order.status !== "pending") return res.status(400).json({ message: "Không thể hủy" });

        // 🔥 TRẢ LẠI KHO
        for (const item of order.items) {
            const product = await Product.findById(item.productId);
            if (product) {
                product.quantity += item.quantity;
                await product.save();
            }
        }

        order.status = "cancelled";
        await order.save();

        await StatusHistory.create({
            order: order._id,
            status: "cancelled",
            changedBy: req.user.id,
            role: "user"
        });

        res.json({ message: "Đã hủy đơn", order });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 📦 USER xem đơn
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id })
            .populate("items.productId")
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};