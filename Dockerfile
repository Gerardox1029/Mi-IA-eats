# Build stage for Frontend
FROM node:22 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN rm -f package-lock.json && npm install
COPY frontend/ ./
RUN npm run build

# Final stage for Backend
FROM node:22
WORKDIR /app
COPY backend/package*.json ./backend/
# Use a clever trick to install all deps from root too
COPY package*.json ./
RUN npm install

COPY backend/ ./backend/
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 5000
CMD ["node", "backend/server.js"]
