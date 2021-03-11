FROM node:12

COPY . /app
WORKDIR /app
RUN npm install
CMD node hls-proxy/bin/hlsd.js --host "127.0.0.1" -v 3
