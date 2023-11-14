FROM node

RUN mkdir -p /app

WORKDIR /app

COPY . /app

RUN npm install

COPY . /app

EXPOSE 3000

RUN npm run build

RUN npm uninstall bcrypt

RUN npm install bcrypt

CMD ["npm", "run", "dev"]