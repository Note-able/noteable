# Dockerfile extending the generic Node image with application files for a
# single application.
FROM node:boron

WORKDIR /app

# Since docker has an image cache, installing dependencies early speeds up most builds.
COPY package.json /app/

# This will only run when there is a change to package.json.
RUN npm install

# Copy the entire application
COPY . /app

# Use NODE as a cmd line arg - default is production
ARG NODE=production
ENV NODE_ENV ${NODE}

# Create the lib directory
RUN npm run dist

EXPOSE 8080

# Move into compiled js folder
WORKDIR /app/lib

# Run the server
CMD node server.js
