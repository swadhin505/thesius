# Use Node.js for Next.js
FROM node:18-alpine

ARG NEXTJS_ENV

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the frontend port
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
