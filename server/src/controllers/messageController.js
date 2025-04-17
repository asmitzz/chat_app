const { Op } = require("sequelize");
const { Message, User } = require("../models");
const { logger } = require("../config/logger");

exports.sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;
    const message = await Message.create({ senderId, receiverId, text });
    logger.error("Message send successfully", error?.message);

    res.status(201).json({ message });
  } catch (error) {
    logger.error("Failed to send message", error?.message);
    res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      attributes: ["id", "senderId", "receiverId", "text"],
      order: [["createdAt", "ASC"]],
      limit: 50,
    });

    const user = await User.findOne({
      where: { id: receiverId },
      attributes: ["id", "username"],
    });

    logger.info("Messages fetched successfully");

    res.json({ messages, user });
  } catch (error) {
    logger.error("Failed to fetch messages", error?.message);
    res.status(500).json({ message: error?.message });
  }
};
