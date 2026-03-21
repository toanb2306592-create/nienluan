const User = require("../models/user.model");

// Lấy tất cả user
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy danh sách user",
            error: error.message
        });
    }
};

// Lấy user theo ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy user" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy user",
            error: error.message
        });
    }
};

// Tạo user
exports.createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        const savedUser = await user.save();

        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({
            message: "Lỗi khi tạo user",
            error: error.message
        });
    }
};

// Cập nhật user
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy user để cập nhật" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({
            message: "Lỗi khi cập nhật user",
            error: error.message
        });
    }
};

// Xóa user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy user để xóa" });
        }

        res.status(200).json({ message: "Xóa user thành công" });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi xóa user",
            error: error.message
        });
    }
};