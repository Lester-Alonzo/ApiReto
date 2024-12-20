FROM node:23-alpine3.19 AS builder

WORKDIR /app
COPY package*.json .
RUN npm i

COPY . .

EXPOSE 5898

CMD [ "npm", "run", "dev" ]