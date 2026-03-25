const Product = require("../models/product.model");
const fs = require("fs");
const path = require("path");

// Hàm xóa ảnh cũ
const deleteFile = (filePath) => {
    if (filePath) {
        // Đường dẫn từ controller ra thư mục gốc /uploads
        const fullPath = path.join(__dirname, "../../", filePath);
        if (fs.existsSync(fullPath)) {
            try {
                fs.unlinkSync(fullPath);
            } catch (err) {
                console.error("Không thể xóa file ảnh:", err.message);
            }
        }
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("categoryId");
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { productName, price, quantity, categoryId, description } = req.body;
        const image = req.file ? `uploads/products/${req.file.filename}` : "";
        const newProduct = new Product({ 
            productName, price, quantity, categoryId, description, image 
        });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const oldProduct = await Product.findById(req.params.id);
        if (!oldProduct) return res.status(404).json({ message: "Không tìm thấy SP" });

        const updateData = { ...req.body };
        if (req.file) {
            deleteFile(oldProduct.image); // Xóa ảnh cũ
            updateData.image = `uploads/products/${req.file.filename}`;
        }

        const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            deleteFile(product.image); // Xóa ảnh vật lý
            await Product.findByIdAndDelete(req.params.id);
            res.json({ message: "Đã xóa sản phẩm và ảnh" });
        } else {
            res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};