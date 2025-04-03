const { body } = require("express-validator");

const loginValidationRules = [
  body("username").isLength({min: 4}).withMessage("Username must be at least 4 characters long"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

const registerValidationRules = [
  body("username").isLength({min: 4}).withMessage("Username must be at least 4 characters long"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

module.exports = {
  loginValidationRules,
  registerValidationRules,
};
