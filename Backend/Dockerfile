# Use Node.js 20 as base image
# Why: Your app runs on Node.js, so we need it in the container
FROM node:20-alpine

# Set working directory inside the container
# Why: All subsequent commands will run from this folder
WORKDIR /app

# Copy package.json first (before copying all code)
# Why: Docker caches layers. If package.json hasn't changed,
#      it won't re-run npm install on every build (faster builds)
COPY package*.json ./

# Install dependencies
# Why: Install all required npm packages inside the container
RUN npm install

# Copy rest of the source code
# Why: Now copy actual code after installing dependencies
COPY . .

# Expose port 3000
# Why: Tell Docker this container listens on port 3000
EXPOSE 3000

# Start the server
# Why: Command to run when container starts
CMD ["node", "server.js"] 