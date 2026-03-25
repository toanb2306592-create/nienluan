const express = require("express");
const router = express.Router();
const controller = require("../controllers/status_history.controller");
const auth = require("../middlewares/auth.middleware");

router.get("/:id", auth, controller.getOrderHistory);

module.exports = router;