FROM node:12-alpine

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . .

ENV WEB_PORT=80

CMD npm run start
