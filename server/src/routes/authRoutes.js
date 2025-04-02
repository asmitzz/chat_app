const express = require("express");
const { register, login,logout, contacts, authenticate } = require("../controllers/authController");
const authenticateUser = require("../middlewares/authenticateUser");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/contacts", authenticateUser, contacts);
router.get("/authenticate", authenticateUser, authenticate);

module.exports = router;
