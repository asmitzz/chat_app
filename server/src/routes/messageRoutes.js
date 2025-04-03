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

const router = express.Router();

router.post("/send", authenticateUser, sendMessageValidationRules, sendMessage);
router.get(
  "/history",
  authenticateUser,
  messageHistoryValidationRules,
  getMessages
);

module.exports = router;
