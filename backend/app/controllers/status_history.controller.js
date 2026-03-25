const StatusHistory = require("../models/status_history.model");
const Order = require("../models/order.model");

// 📦 Lấy lịch sử trạng thái đơn
exports.getOrderHistory = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;
    const role = req.user.role;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // 🔐 chỉ admin hoặc chủ đơn mới xem được
    if (role !== "admin" && order.userId.toString() !== userId) {
      return res.status(403).json({ message: "Không có quyền xem" });
    }

    const history = await StatusHistory.find({ order: orderId })
      .populate("changedBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(history);

  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy lịch sử",
      error: error.message
    });
  }
};