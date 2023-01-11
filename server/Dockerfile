FROM node:18.12.1-bullseye-slim AS builder-modules
WORKDIR /usr/src/app
COPY package*.json /usr/src/app/
RUN npm ci --only=production

FROM node:18.12.1-bullseye-slim AS builder-server
WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN npm install
RUN npx webpack

FROM node:18.12.1-bullseye-slim
ENV NODE_ENV production
USER node
WORKDIR /usr/src/app
COPY --chown=node:node --from=builder-modules /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node --from=builder-server /usr/src/app/dist /usr/src/app
CMD ["node", "index.js"] --init