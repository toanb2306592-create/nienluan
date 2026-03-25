const Category = require("../models/category.model");
const mongoose = require("mongoose");

// GET ALL
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy danh sách category",
            error: error.message
        });
    }
};

// GET BY ID
exports.getCategoryById = async (req, res) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID không hợp lệ" });
        }

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ message: "Không tìm thấy category" });
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy category",
            error: error.message
        });
    }
};

// CREATE ✅ FIX name
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Tên category là bắt buộc" });
        }

        const newCategory = new Category({
            name,
            description: description || ""
        });

        const saved = await newCategory.save();

        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({
            message: "Lỗi khi tạo category",
            error: error.message
        });
    }
};

// UPDATE ✅ FIX sạch dữ liệu
exports.updateCategory = async (req, res) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID không hợp lệ" });
        }

        const { name, description } = req.body;

        const updated = await Category.findByIdAndUpdate(
            id,
            { name, description },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Không tìm thấy category để cập nhật" });
        }

        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({
            message: "Lỗi khi cập nhật category",
            error: error.message
        });
    }
};

// DELETE
exports.deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID không hợp lệ" });
        }

        const deleted = await Category.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: "Không tìm thấy category để xóa" });
        }

        res.status(200).json({ message: "Xóa category thành công" });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi xóa category",
            error: error.message
        });
    }
};