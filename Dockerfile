FROM node:14
WORKDIR /usr/src/api-secret-message
COPY ./package.json .
RUN npm install --only=prod
COPY ./dist ./dist
EXPOSE 7000
CMD npm start