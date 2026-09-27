FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "server.js"]
