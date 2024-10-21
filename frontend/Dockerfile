FROM node:18-slim

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY ./src ./src
COPY ./public ./public

COPY ./index.html ./index.html
COPY ./vite.config.js ./vite.config.js
COPY ./eslint.config.js ./eslint.config.js

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]

