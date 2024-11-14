# Build Stage
FROM node:20 AS build-stage 
WORKDIR /usr/src/app
COPY . .
RUN npm ci
RUN npm test
RUN npm run build

# Serve Stage
FROM nginx:1.25-alpine
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html