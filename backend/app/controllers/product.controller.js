const Product = require("../models/product.model");
const fs = require("fs");
const path = require("path");

// Hàm xóa ảnh cũ
const deleteFile = (filePath) => {
    if (filePath) {
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

// 1. Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("categoryId");
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. MỚI: Lấy chi tiết 1 sản phẩm theo ID (Dùng cho trang ProductDetail)
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("categoryId");
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server: " + error.message });
    }
};

// 3. Tạo sản phẩm mới
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

// 4. Cập nhật sản phẩm
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

// 5. Xóa sản phẩm
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

