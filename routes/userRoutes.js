const express = require("express");
const router = express.Router();
const { handleRegisterUser, handleUserLogin } = require("../controllers/userController");

router.post("/register", handleRegisterUser);
router.post("/login", handleUserLogin); // Use post instead of get for login

module.exports = router;