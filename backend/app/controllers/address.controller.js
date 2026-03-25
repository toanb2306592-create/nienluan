const Address = require("../models/address.model");
const mongoose = require("mongoose");

// 📦 Lấy địa chỉ của user (từ token)
exports.getAddressByUser = async (req, res) => {
    try {
        const userId = req.user.id;

        const addresses = await Address.find({ userId });

        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy địa chỉ",
            error: error.message
        });
    }
};

// ➕ Tạo địa chỉ
exports.createAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { fullName, phone, address, isDefault } = req.body;

        if (!fullName || !phone || !address) {
            return res.status(400).json({ message: "Thiếu dữ liệu" });
        }

        // nếu set mặc định → bỏ mặc định cũ
        if (isDefault) {
            await Address.updateMany({ userId }, { isDefault: false });
        }

        const newAddress = new Address({
            userId,
            fullName,
            phone,
            address,
            isDefault
        });

        const saved = await newAddress.save();

        res.status(201).json(saved);

    } catch (error) {
        res.status(400).json({
            message: "Lỗi khi tạo địa chỉ",
            error: error.message
        });
    }
};

// 🔄 Cập nhật địa chỉ
exports.updateAddress = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID không hợp lệ" });
        }

        const address = await Address.findOne({ _id: id, userId });

        if (!address) {
            return res.status(403).json({ message: "Không có quyền" });
        }

        if (req.body.isDefault) {
            await Address.updateMany({ userId }, { isDefault: false });
        }

        Object.assign(address, req.body);
        await address.save();

        res.status(200).json(address);

    } catch (error) {
        res.status(400).json({
            message: "Lỗi khi cập nhật",
            error: error.message
        });
    }
};

// ❌ Xóa địa chỉ
exports.deleteAddress = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID không hợp lệ" });
        }

        const deleted = await Address.findOneAndDelete({
            _id: id,
            userId
        });

        if (!deleted) {
            return res.status(404).json({ message: "Không tìm thấy địa chỉ" });
        }

        res.status(200).json({ message: "Xóa địa chỉ thành công" });

    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi xóa",
            error: error.message
        });
    }
};