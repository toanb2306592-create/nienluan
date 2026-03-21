const Order = require("../models/order.model");


exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("userId")
            .populate("items.productId");

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy danh sách đơn hàng",
            error: error.message
        });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("userId")
            .populate("items.productId");

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

exports.createOrder = async (req, res) => {
    try {
        const { userId, items } = req.body;

        let totalAmount = 0;
        items.forEach(item => {
            totalAmount += item.price * item.quantity;
        });

        const order = new Order({
            userId,
            items,
            totalAmount
        });

        const savedOrder = await order.save();

        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(400).json({
            message: "Lỗi khi tạo đơn hàng",
            error: error.message
        });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng để cập nhật" });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({
            message: "Lỗi khi cập nhật đơn hàng",
            error: error.message
        });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng để xóa" });
        }

        res.status(200).json({ message: "Xóa đơn hàng thành công" });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi xóa đơn hàng",
            error: error.message
        });
    }
};