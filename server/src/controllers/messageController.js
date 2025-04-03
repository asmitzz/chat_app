const { Op } = require("sequelize");
const { Message, User } = require("../models");

exports.sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;
    const message = await Message.create({ senderId, receiverId, text });

    res.status(201).json({ message });
  } catch (error) {
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

    res.json({ messages, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
