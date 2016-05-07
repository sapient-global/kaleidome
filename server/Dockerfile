FROM mhart/alpine-node
WORKDIR /app

ENV NODE_ENV=production 
#we want to cache the the npm install
COPY package.json .
# Install app dependencies
RUN npm install

# Adding the rest of the app source
COPY . .
#we are using dokku on the server and we need a nginx config file to have https
# ADD ./nginx.conf.sigil /app/nginx.conf.sigil

EXPOSE 80
CMD [ "node", "server.js" ]