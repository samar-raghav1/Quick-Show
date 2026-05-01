# Stage 1: Dependencies & Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy configuration files
COPY package*.json ./

# Install ALL dependencies (including devDependencies)
RUN npm install

# Copy source code
COPY . .

# Optional: Run build if using TypeScript
# RUN npm run build

# Stage 2: Production Runtime
FROM node:20-alpine
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist 
# Note: If not using TS/Build step, copy your source folder instead:
# COPY --from=builder /app/src ./src

# Use a non-root user for security
USER node

EXPOSE 3000

CMD ["node", "dist/server.js"]