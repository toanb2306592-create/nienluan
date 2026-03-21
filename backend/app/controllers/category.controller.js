const Category = require("../models/category.model");
const mongoose = require("mongoose");


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

exports.createCategory = async (req, res) => {
    try {
        const { categoryName, description } = req.body;

        if (!categoryName) {
            return res.status(400).json({ message: "Tên category là bắt buộc" });
        }

        const newCategory = new Category({
            categoryName,
            description
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

// Cập nhật category
exports.updateCategory = async (req, res) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID không hợp lệ" });
        }

        const updated = await Category.findByIdAndUpdate(
            id,
            req.body,
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