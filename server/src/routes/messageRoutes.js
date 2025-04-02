const express = require("express");
const {
  sendMessage,
  getMessages,
} = require("../controllers/messageController");
const authenticateUser = require("../middlewares/authenticateUser");

const router = express.Router();

router.post("/send", authenticateUser, sendMessage);
router.get("/history", authenticateUser, getMessages);

module.exports = router;
