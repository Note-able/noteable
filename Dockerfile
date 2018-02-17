# Dockerfile extending the generic Node image with application files for a
# single application.
FROM node:alpine

ARG NODE=production

WORKDIR /app

# Since docker has an image cache, installing dependencies early speeds up most builds.
COPY package.json /app

# This will only run when there is a change to package.json.
# add npm set progress=false
RUN  npm install -g -s --no-progress yarn && yarn --ignore-engines --ignore-scripts --silent

COPY . /app

# Use NODE as a cmd line arg - default is production
ENV NODE_ENV ${NODE}

# Create the lib directory
RUN npm run dist

EXPOSE 8080

# Run the server
CMD node lib/src/server/server.js
