const Cart = require("../models/cart.model");

// 📦 Lấy giỏ hàng theo userId
exports.getCart = async (req, res) => {
    try {
        const { userId } = req.params;
        let cart = await Cart.findOne({ userId }).populate("items.productId");
        if (!cart) {
            cart = await Cart.create({ userId, items: [] });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ➕ Thêm vào giỏ
exports.addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        if (!userId || !productId || !quantity) {
            return res.status(400).json({ message: "Thiếu dữ liệu đầu vào" });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) cart = new Cart({ userId, items: [] });

        const index = cart.items.findIndex(item => item.productId.toString() === productId);
        if (index > -1) {
            cart.items[index].quantity += Number(quantity);
        } else {
            cart.items.push({ productId, quantity: Number(quantity) });
        }

        await cart.save();
        res.json({ message: "Đã thêm vào giỏ", cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✏️ Cập nhật số lượng
exports.updateCartItem = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ" });

        const item = cart.items.find(i => i.productId.toString() === productId);
        if (item) {
            item.quantity = Number(quantity);
            await cart.save();
        }
        res.json({ message: "Cập nhật thành công", cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ❌ Xóa sản phẩm - Đã tối ưu để xóa sạch trong DB
exports.removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        
        // $pull sẽ xóa item có productId khớp ra khỏi mảng items
        const result = await Cart.updateOne(
            { userId: userId }, 
            { $pull: { items: { productId: productId } } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Không tìm thấy món hàng để xóa" });
        }

        res.json({ message: "Đã xóa sản phẩm khỏi Database thành công" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};