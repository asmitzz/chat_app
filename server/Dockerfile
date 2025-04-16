FROM node:22

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install && yarn global add pm2

COPY . .

COPY .env .env

EXPOSE 8000
# CMD ["sh", "-c", "cd src && npx sequelize db:migrate && cd .. && yarn start"]
# CMD ["pm2-runtime", "ecosystem.config.js"]