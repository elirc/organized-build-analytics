FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY backend/package*.json backend/
RUN npm install --workspaces --include-workspace-root

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run db:generate -w backend
RUN npm run build -w backend

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/backend/package.json ./backend/package.json
COPY --from=build /app/backend/prisma ./backend/prisma
CMD ["node", "backend/dist/server.js"]
