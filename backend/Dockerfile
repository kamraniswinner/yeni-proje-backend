# Use an official Node runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# If you are building your code for production
# RUN npm ci --only=production

# Copy the rest of the application code to the working directory
COPY . .

# Make port 8080 available to the world outside this container
EXPOSE 8085

# Define the command to run your application
CMD ["npm", "start"]
