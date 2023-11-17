FROM node:alpine

RUN mkdir -p /app

WORKDIR /app

RUN npm install --global pm2

COPY ./package*.json /app

RUN npm ci

RUN npm uninstall bcrypt

RUN npm install bcrypt

COPY ./ ./

RUN npm run build

EXPOSE 3000

USER node

CMD [ "pm2-runtime", "npm", "--", "start" ]