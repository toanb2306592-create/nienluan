
const mongoose = require('mongoose');

const connectDB = async () => {
     try {
        await mongoose.connect("mongodb://127.0.0.1:27017/supermarket");
        console.log("Kết nối CSDL thành công");
    } catch (error) {
        console.error("Kết nỗi CSDL gặp lỗi:", error);
        process.exit(1);
    }
};

module.exports = connectDB;