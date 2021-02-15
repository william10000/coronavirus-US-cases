FROM node:15-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . /app
CMD ["npm", "start"]
