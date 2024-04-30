# Use a recent but LTS (Long-Term Support) Node.js version
FROM node:18-LTS-alpine

# Set working directory
WORKDIR /app

# Optional: Consider using multi-stage builds for smaller images
# See resources online for details on multi-stage builds.

# Copy package.json and package-lock.json for dependency management
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose port
EXPOSE 3000

# Start the server using the configured script
CMD [ "npm", "run", "start:prod" ]
