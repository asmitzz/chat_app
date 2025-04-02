const jwt = require("jsonwebtoken");
const { Message, User, sequelize } = require("../models");
const { server } = require("../app");

let sender;
let receiver;
let token;
let agent;

beforeAll(async () => {
  const setupTests = require("./testSetup");
  agent = await setupTests();
  await sequelize.sync({ force: true });

  sender = await User.create({ username: "senderUser", password: "password123" });
  receiver = await User.create({ username: "receiverUser", password: "password123" });

  token = jwt.sign({ id: sender.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
});

afterAll(async () => {
  await sequelize.close();
  if (server && server.close) {
    server.close();
  }
});

describe("Message Controller", () => {
  test("Should send a message", async () => {
    const res = await agent
      .post("/messages/send")
      .set("Cookie", `token=${token}`)
      .send({ senderId: sender.id, receiverId: receiver.id, text: "Hello!" });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toHaveProperty("id");
    expect(res.body.message.text).toBe("Hello!");
  });

  test("Should fetch messages between two users", async () => {
    await Message.create({ senderId: sender.id, receiverId: receiver.id, text: "Hey there!" });

    const res = await agent
      .get("/messages/history")
      .query({ senderId: sender.id, receiverId: receiver.id })
      .set("Cookie", `token=${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.messages.length).toBeGreaterThan(0);
    expect(res.body.user.username).toBe(receiver.username);
  });

  test("Should return 400 if senderId or receiverId is missing", async () => {
    const res = await agent
      .get("/messages/history")
      .query({ senderId: sender.id })
      .set("Cookie", `token=${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Sender and receiver IDs are required.");
  });
});