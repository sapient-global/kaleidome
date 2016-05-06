# This config is taken from the node.js page.
# node config

FROM node:argon

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# The files under the server folder are available in the same folder as the rest of the app
COPY package.json /usr/src/app/

# Install app dependencies
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 8080
CMD [ "npm", "start" ]
