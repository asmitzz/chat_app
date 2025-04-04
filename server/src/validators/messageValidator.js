const { body, query } = require("express-validator");

const sendMessageValidationRules = [
  body("senderId").notEmpty().withMessage("Sender ID is required"),
  body("receiverId").notEmpty().withMessage("Receiver ID is required"),
  body("text").trim().notEmpty().withMessage("Message is required"),
];

const messageHistoryValidationRules = [
  query("senderId").notEmpty().withMessage("Sender ID is required"),
  query("receiverId").notEmpty().withMessage("Receiver ID is required"),
];

module.exports = {
  sendMessageValidationRules,
  messageHistoryValidationRules,
};
