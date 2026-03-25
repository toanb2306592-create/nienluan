const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

// [POST] /api/users (Register)
exports.createUser = async (req, res) => {
    try {
        // ✅ CHỈ tạo instance, Model sẽ tự Hash mật khẩu khi gọi .save()
        const user = new User(req.body); 
        const saved = await user.save();

        const token = jwt.sign(
            { id: saved._id, role: saved.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({ user: saved, token });
    } catch (error) {
        res.status(400).json({ 
            message: error.code === 11000 ? "Email đã tồn tại" : "Đăng ký thất bại" 
        });
    }
};

// [PUT] /api/users/:id
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

        // Cập nhật dữ liệu
        if (req.body.password) user.password = req.body.password;
        if (req.body.name) user.name = req.body.name;
        if (req.body.phone) user.phone = req.body.phone;

        // Lưu lại (Kích hoạt lại Middleware hash mật khẩu nếu password thay đổi)
        await user.save();
        res.json({ message: "Cập nhật thành công", user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Xóa thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};