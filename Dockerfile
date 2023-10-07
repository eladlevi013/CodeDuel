# Use an official Node image as a base
FROM node:14

# Set working directory
WORKDIR /usr/src/app

# Install Python and Java JDK
RUN apt-get update && apt-get install -y python3 openjdk-11-jdk && apt-get clean

# Copy package.json, package-lock.json, and tsconfig.json before other files
# Utilize Docker cache to save re-installing dependencies if unchanged
COPY package*.json tsconfig.json ./

# Install Node dependencies
RUN npm install

# Install TypeScript globally in the container
RUN npm install -g typescript

# Copy all files from the current directory to the container
COPY . .

# Compile TypeScript to JavaScript
RUN tsc

# Start the server using the compiled JavaScript file from the dist directory
CMD ["node", "dist/index.js"]
