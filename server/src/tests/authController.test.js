const { User, sequelize } = require("../models");
const jwt = require("jsonwebtoken");
const { server } = require("../app");

let token;
let agent;

beforeAll(async () => {
  const setupTests = require("./testSetup");
  agent = await setupTests();
  await User.destroy({ where: {} });

  // Create a test user
  const user = await User.create({
    username: "testuser",
    password: await require("bcryptjs").hash("password123", 10),
  });

  token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
});

afterAll(async () => {
  await User.destroy({ where: {} });
  await sequelize.close();
  if (server && server.close) {
    server.close();
  }
});

describe("Authentication Routes", () => {
  test("User registration", async () => {
    const response = await agent.post("/auth/register").send({
      username: "newuser",
      password: "password123",
    });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "User registered successfully"
    );
  });

  test("User login with valid credentials", async () => {
    const response = await agent.post("/auth/login").send({
      username: "testuser",
      password: "password123",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("user");
  });

  test("User login with invalid credentials", async () => {
    const response = await agent.post("/auth/login").send({
      username: "testuser",
      password: "wrongpassword",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid credentials");
  });

  test("User logout", async () => {
    const response = await agent
      .post("/auth/logout")
      .set("Cookie", `token=${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Logged out successfully!");
  });

  test("User authentication", async () => {
    const response = await agent
      .get("/auth/authenticate")
      .set("Cookie", `token=${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("user");
  });
});

describe("Contacts Route", () => {
  test("Retrieve contacts with authentication", async () => {
    const response = await agent
      .get("/auth/contacts")
      .set("Cookie", `token=${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("contacts");
  });

  test("Retrieve contacts without authentication", async () => {
    const response = await agent.get("/auth/contacts");
    expect(response.statusCode).toBe(401);
  });
});
