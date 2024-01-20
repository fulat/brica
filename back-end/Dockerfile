FROM node:18.14.1

WORKDIR /app

COPY package.json ./
RUN yarn

COPY . .

CMD ["yarn", "start"]
