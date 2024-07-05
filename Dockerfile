# Use an official Node.js runtime as a parent image
FROM node:20.15.0-bullseye-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install PM2 globally and install dependencies
RUN npm install pm2 -g && \
    npm ci --omit=dev

# Copy the application source code
COPY ./src ./src

# Set environment variable
ENV NODE_ENV=production

# Expose the application port
EXPOSE 3001

# Use PM2 to run the application
CMD ["pm2-runtime", "npm", "--", "start"]
