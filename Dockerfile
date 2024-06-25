FROM node:20.15.0-bullseye-slim

WORKDIR /urs/src/app

COPY package*.json ./

RUN npm i pm2 -g \
npm ci --omit=dev

# COPY . .
# Copy only the app & node_modules folders
COPY ./src ./src
COPY ./node_modules ./node_modules

ENV NODE_ENV=PRODUCTION

EXPOSE 3001

CMD [ "pm2-runtime", "npm", "--", "start" ]