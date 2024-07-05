FROM node:18.17.1

WORKDIR /app
RUN npm install -g node-gyp node-pre-gyp
RUN apt-get install -y python3
# COPY . .

# RUN npm install --quiet --no-optional --no-fund --loglevel=error

# RUN npm run build
EXPOSE 5002


CMD [ ]



# FROM node
# WORKDIR /usr/src
# COPY . .
# RUN npm i
# RUN npm run build
# CMD ["npm", "start"]
# # tem menu de contexto