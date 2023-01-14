FROM node:18.12.1-bullseye-slim AS builder-client
COPY . .
ENV LLNKTS_TEST_VAR=form_client_dockerfile
ENV LLNKTS_SERVER_URL=http://localhost:8080
RUN npm install
RUN npx webpack

FROM nginx:1.23.3-alpine
COPY --from=builder-client ./dist /usr/share/nginx/html