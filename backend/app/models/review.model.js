const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true
  },

  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product",
    required: true
  },

  // 📦 chỉ cho review nếu đã mua
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order"
  },

  // ⭐ snapshot
  userName: {
    type: String
  },

  productName: {
    type: String
  },

  rating: { 
    type: Number, 
    min: 1, 
    max: 5,
    required: true
  },

  comment: {
    type: String,
    trim: true
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  }

}, {
  timestamps: true
});

// 🔥 mỗi user chỉ review 1 lần / sản phẩm
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);