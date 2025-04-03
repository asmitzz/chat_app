const express = require("express");
const {
  register,
  login,
  logout,
  contacts,
  authenticate,
} = require("../controllers/authController");
const authenticateUser = require("../middlewares/authenticateUser");
const {
  loginValidationRules,
  registerValidationRules,
} = require("../validators/authValidator");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.post("/register", registerValidationRules, validateRequest, register);
router.post("/login", loginValidationRules, validateRequest, login);
router.post("/logout", logout);
router.get("/contacts", authenticateUser, contacts);
router.get("/authenticate", authenticateUser, authenticate);

module.exports = router;
