FROM node:24.6.0

WORKDIR /app

COPY package*.json ./

RUN npm ci 

COPY . .

CMD ["npm", "run", "start:dev"]
