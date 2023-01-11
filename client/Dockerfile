FROM node:18.12.1-bullseye-slim AS builder-client
COPY . .
RUN npm install
RUN npx webpack

FROM nginx:1.23.3-alpine
COPY --from=builder-client ./dist /usr/share/nginx/html