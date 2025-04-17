const winston = require("winston");
const WinstonCloudWatch = require("winston-cloudwatch");
require('dotenv').config();

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new WinstonCloudWatch({
      level: "info",
      logGroupName: "ey-chat-logs",
      logStreamName: "app-logs",
      jsonMessage: true,
      awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
      awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
      awsRegion: process.env.AWS_REGION,
    }),
    new WinstonCloudWatch({
        level: "error",
        logGroupName: "ey-chat-logs",
        logStreamName: "errors",
        jsonMessage: true,
        awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
        awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
        awsRegion: process.env.AWS_REGION,
      }),
  ],
});

module.exports = { logger };
