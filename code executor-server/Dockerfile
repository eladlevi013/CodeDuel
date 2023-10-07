# Use an official Node image as a base
FROM node:14

# Set working directory
WORKDIR /usr/src/app

# Install Python and Java JDK
RUN apt-get update && apt-get install -y python3 openjdk-11-jdk && apt-get clean

# Copy package.json and package-lock.json before other files
# Utilize Docker cache to save re-installing dependencies if unchanged
COPY package*.json ./

RUN npm install

# Copy all files
COPY . .

# Start the server
CMD ["node", "index.js"]