FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY frontend/package*.json frontend/
RUN npm install --workspaces --include-workspace-root

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build -w frontend

FROM nginx:1.27-alpine
COPY --from=build /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
