const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const jwt = require("jsonwebtoken");

// ĐĂNG KÝ: Tạo User + Tạo luôn Giỏ hàng trống
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email đã tồn tại" });

        const newUser = new User({ name, email, password });
        const savedUser = await newUser.save();

        // ✨ KHỞI TẠO GIỎ HÀNG TRỐNG CHO USER
        const newCart = new Cart({
            userId: savedUser._id,
            items: []
        });
        await newCart.save();

        res.status(201).json({ message: "Đăng ký thành công!", user: savedUser });
    } catch (error) {
        res.status(500).json({ message: "Lỗi đăng ký", error: error.message });
    }
};

// ĐĂNG NHẬP: Trả về thông tin user để lưu vào LocalStorage
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Email không tồn tại" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};