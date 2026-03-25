const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            productName: String,
            image: String,
            quantity: Number,
            price: Number
        }
    ],

    totalAmount: {
        type: Number,
        required: true
    },

    // 📌 trạng thái đơn hàng
    status: {
        type: String,
        enum: ["pending", "confirmed", "shipping", "completed", "cancelled"],
        default: "pending"
    },

    // 💸 trạng thái thanh toán
    paymentStatus: {
        type: String,
        enum: ["unpaid", "paid", "failed"],
        default: "unpaid"
    },

    // 📍 địa chỉ (snapshot)
    shippingAddress: {
        fullName: String,
        phone: String,
        address: String
    },

    // vẫn giữ để truy xuất
    addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    },

    // ⏱️ thời gian
    orderDate: {
        type: Date,
        default: Date.now
    },
    confirmedAt: Date,
    shippingAt: Date,
    deliveryDate: Date,
    receivedAt: Date

}, {
    timestamps: true // createdAt, updatedAt
});

module.exports = mongoose.model("Order", orderSchema);