# Use the base image with Node.js
FROM node:21.6.0

# Copy the current directory into the Docker image
COPY . /resource-processor-es

# Set working directory for future use
WORKDIR /resource-processor-es

# Install the dependencies from package.json
RUN npm install
CMD node src/app.js
