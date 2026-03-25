const express = require("express"); 
const cors = require("cors"); 
const path = require("path");

const app = express(); 

app.use(cors()); 
app.use(express.json()); 

// Import Routes
const userRoutes = require("./app/routes/user.route");
const categoryRoutes = require("./app/routes/category.route");
const productRoutes = require("./app/routes/product.route");
const orderRoutes = require("./app/routes/order.route");
const authRoutes = require("./app/routes/auth.route");
const cartRoutes = require("./app/routes/cart.route");
const reviewRoutes = require("./app/routes/review.route");
const addressRoutes = require("./app/routes/address.route");
// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ ROUTES CHUẨN
app.use("/api/auth", authRoutes); // Login sẽ là: /api/auth/login
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/address", addressRoutes);
app.get("/", (req, res) => { 
    res.json({ message: "Welcome to the supermarket application." }); 
}); 

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({ message: "Resource not found" });
});

// Error Handler
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;