FROM node:14
WORKDIR /usr/src/api-secret-message
COPY ./package.json .
RUN npm install --only=prod