# Build stage
FROM node:20-alpine as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json package-lock.json ./
RUN npm install --production
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/tsconfig.json ./tsconfig.json
EXPOSE 4000
CMD ["npm", "run", "start:prod"]