FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 5173

# -- --host to force vite to accept extern connections
CMD [ "npm", "run", "dev", "--", "--host" ]