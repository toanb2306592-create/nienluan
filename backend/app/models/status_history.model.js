const mongoose = require("mongoose");

const statusHistorySchema = new mongoose.Schema({
  order: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Order",
    required: true
  },

  status: { 
    type: String,
    enum: ["pending", "confirmed", "shipping", "completed", "cancelled"],
    required: true
  },

  changedAt: { 
    type: Date, 
    default: Date.now 
  },

  changedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User"
  },

  role: {
    type: String,
    enum: ["user", "admin"]
  }

}, {
  timestamps: true
});

// 🔥 tối ưu query
statusHistorySchema.index({ order: 1 });

module.exports = mongoose.model("StatusHistory", statusHistorySchema);