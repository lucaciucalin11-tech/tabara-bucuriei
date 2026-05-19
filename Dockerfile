FROM node:20-alpine

WORKDIR /app

COPY client/package.json ./client/
RUN cd client && npm install --legacy-peer-deps

COPY client/ ./client/
RUN cd client && npm run build

COPY server/package.json ./server/
RUN cd server && npm install

COPY server/ ./server/

RUN mkdir -p /data

ENV DATA_DIR=/data
ENV PORT=3001
ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "server/index.js"]
