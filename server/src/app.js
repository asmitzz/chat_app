require("dotenv").config();
const express = require("express");
const { logger } = require("./config/logger");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const app = express();
app.use(cookieParser());
app.use(express.json());

const server = http.createServer(app);
const allowedOrigins = [
  "http://localhost:3000",
  "http://client:3000",
  "http://44.202.238.36:3000",
];
const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST"],
  credentials: true,
};

const io = socketIo(server, {
  cors: corsOptions,
});

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("server is running..");
});
app.use("/auth", authRoutes);
app.use("/messages", messageRoutes);
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).send('Something broke!');
});
io.on("connection", (socket) => {
  socket.on("join", (receiverId) => {
    socket.join(receiverId?.toString());
  });

  socket.on("typing_indicator", (messageData) => {
    const { receiverId } = messageData;
    io.to(receiverId).emit("is_typing", messageData);
  });

  socket.on("send_message", async (messageData) => {
    const { receiverId, senderId, text } = messageData;

    const { Message } = require("./models");
    await Message.create({
      senderId,
      receiverId,
      text,
    });

    io.to(receiverId).emit("receive_message", messageData);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, "0.0.0.0", () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}

module.exports = { server, app };
