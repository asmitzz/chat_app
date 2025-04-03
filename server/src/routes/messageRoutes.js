const express = require("express");
const {
  sendMessage,
  getMessages,
} = require("../controllers/messageController");
const authenticateUser = require("../middlewares/authenticateUser");
const {
  sendMessageValidationRules,
  messageHistoryValidationRules,
} = require("../validators/messageValidator");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.post(
  "/send",
  authenticateUser,
  sendMessageValidationRules,
  validateRequest,
  sendMessage
);
router.get(
  "/history",
  authenticateUser,
  messageHistoryValidationRules,
  validateRequest,
  getMessages
);

module.exports = router;
