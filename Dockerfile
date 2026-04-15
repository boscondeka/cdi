# Dockerfile
# base image
# Use a base Node.js image
FROM node:20-alpine AS base

RUN apk add --no-cache nano
# Set the working directory in the container
WORKDIR /rootdir

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

RUN npm install -g npm@latest

# Install dependencies
RUN npm install --force


# Copy the entire project to the working directory
COPY . .

RUN pwd
# Copy .env.local from host machine to the container
COPY .env.local .env.local

# Build the Next.js app for production
RUN npm run build

# Expose the port on which the Next.js app will run
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]


