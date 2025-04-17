const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { Op, Sequelize } = require("sequelize");
const { logger } = require("../config/logger");

exports.authenticate = async (req, res) => {
  const user = await User.findOne({
    where: { id: req.user?.id },
    attributes: ["id", "username"],
  });
  res.json({ message: "User authenticated", user });
};

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const isExists = await User.findOne({ where: { username } });
    if (isExists)
      return res
        .status(403)
        .json({ message: "User with this username is already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ username, password: hashedPassword });
    delete user.password;

    logger.info("User registered successfully", user);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userWithoutPassword = await User.findOne({
      where: { username },
      attributes: ["id", "username"],
    });
    logger.info("User logged in successfully", userWithoutPassword.id);

    res.json({
      user: userWithoutPassword,
      message: "User logged in successfully",
    });
  } catch (error) {
    logger.error(error?.message);
    res.status(500).json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  logger.info("User logged out successfully");
  res.clearCookie("token");
  res.send("Logged out successfully!");
};

exports.contacts = async (req, res) => {
  try {
    const userId = req?.user?.id;
    const queryToGetLastMessageTime = `(
            SELECT "createdAt" FROM "Messages"
            WHERE ("senderId" = ${userId} AND "receiverId" = "User".id)
            OR ("senderId" = "User".id AND "receiverId" = ${userId})
            ORDER BY "createdAt" DESC 
            LIMIT 1
          )`;

    const contacts = await User.findAll({
      where: {
        id: {
          [Op.ne]: userId,
        },
      },
      attributes: [
        "id",
        "username",
        [
          Sequelize.literal(`(
            SELECT text FROM "Messages"
            WHERE ("senderId" = ${userId} AND "receiverId" = "User".id)
            OR ("senderId" = "User".id AND "receiverId" = ${userId})
            ORDER BY "createdAt" DESC 
            LIMIT 1
          )`),
          "last_message",
        ],
        [Sequelize.literal(queryToGetLastMessageTime), "last_message_time"],
      ],
      order: [
        [
          Sequelize.literal(`
          COALESCE(${queryToGetLastMessageTime}, '1970-01-01T00:00:00.000Z')
        `),
          "DESC",
        ],
      ],
    });
    logger.info("Contacts fetched successfully");

    res.json({ contacts, message: "Contacts fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
