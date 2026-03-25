const express = require("express");
const router = express.Router();

const controller = require("../controllers/address.controller");
const auth = require("../middlewares/auth.middleware");


router.get("/", auth, controller.getAddressByUser);
router.post("/", auth, controller.createAddress);
router.put("/:id", auth, controller.updateAddress);
router.delete("/:id", auth, controller.deleteAddress);

module.exports = router;