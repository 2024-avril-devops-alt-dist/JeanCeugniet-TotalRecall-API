FROM node:18-alpine
# install openssl
RUN apk update && apk upgrade
RUN apk add --no-cache openssl
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install
RUN npx prisma generate
CMD ["npm", "run", "dev"]