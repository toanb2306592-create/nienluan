const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 0 },
    image: { type: String },
    // Đảm bảo tên Model tham chiếu đúng là "Category"
    categoryId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Category", 
        required: true 
    },
    description: String
}, { timestamps: true });

// Xuất model ra để các file khác dùng
module.exports = mongoose.model("Product", productSchema);