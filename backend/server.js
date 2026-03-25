require("dotenv").config();

const app = require("./app");
const config = require("./app/config/index");
const connectDB = require("./app/config/db.config");

async function startServer() {
    try {

        await connectDB();

        app.listen(config.app.port, () => {
            console.log(`Server đang chạy trên cổng ${config.app.port}`);
        });

    } catch (error) {
        console.error("Không thể khởi động server:", error);
        process.exit(1);
    }
}

startServer();