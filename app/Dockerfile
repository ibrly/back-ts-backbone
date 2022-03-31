FROM node:lts-alpine

WORKDIR /app

COPY package*.json .
COPY node_modules .
RUN npm install && npm cache clean --force

CMD ["npm" ,"run","dev"]
