const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productName: String,
    price: Number,
    description: String,
    image: String,
    quantity: Number,
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    }
});

module.exports = mongoose.model("Product", productSchema);