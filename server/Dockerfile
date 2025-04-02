FROM node:22

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

COPY .env .env

EXPOSE 8000
CMD ["sh", "-c", "cd src && npx sequelize db:migrate && cd .. && yarn start"]