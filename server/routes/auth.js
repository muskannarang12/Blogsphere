const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/verify-code", authController.verifyCode); // Add this route
router.post("/login", authController.login);

module.exports = router;