# Use a specific Node.js image
FROM node:20.15.1-alpine3.20

# Create a working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

RUN npx prisma migrate
RUN npx prisma generate

# Run Prisma migrations
CMD ["sh", "-c", "npm start"]
