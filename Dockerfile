# Dockerfile extending the generic Node image with application files for a
# single application.
FROM node:argon

RUN mkdir -p /app
WORKDIR /app
RUN ls

COPY ./lib /app

RUN npm install --only={prod}
RUN npm run dist
# --loglevel=silent install
# You have to specify "--unsafe-perm" with npm install
# when running as root.  Failing to do this can cause
# install to appear to succeed even if a preinstall
# script fails, and may have other adverse consequences
# as well.
# This command will also cat the npm-debug.log file after the
# build, if it exists.

EXPOSE 8080
CMD cd ./app/lib
CMD node server.js
