const { sequelize } = require("../models");
const { app, server } = require("../app");
const request = require("supertest");

let agent;

const setupTests = async () => {
  await sequelize.sync({ force: true });

  if (!server.listening) {
    await new Promise((resolve) => server.listen(8000, resolve));
  }

  agent = request.agent(app);

  return agent;
};

module.exports = setupTests;
