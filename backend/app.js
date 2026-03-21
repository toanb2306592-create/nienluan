const express = require("express"); 
const cors = require("cors"); 

const app = express(); 

app.use(cors()); 
app.use(express.json()); 

const userRoutes = require("./app/routes/user.route");
const categoryRoutes = require("./app/routes/category.route");
const productRoutes = require("./app/routes/product.route");
const orderRoutes = require("./app/routes/order.route");


app.get("/", (req, res) => { 
    res.json({ message: "Welcome to the supermarket application." }); 
}); 


app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);


app.use((req, res, next) => {
    res.status(404).json({ message: "Resource not found" });
});


app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;