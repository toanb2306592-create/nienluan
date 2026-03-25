const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth.middleware");
const admin = require("../middlewares/admin.middleware");

/* 🔓 REGISTER */
router.post("/", userController.createUser);

/* 🔐 USER */
router.get("/me", auth, userController.getMe);

/* 🔐 ADMIN */
router.get("/", auth, admin, userController.getAllUsers);
router.put("/:id", auth, userController.updateUser);
router.delete("/:id", auth, admin, userController.deleteUser);

module.exports = router;