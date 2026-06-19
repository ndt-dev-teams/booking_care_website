FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (caching layer)
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npx prisma generate
RUN npm run build

# Remove devDependencies to keep the node_modules small
RUN npm prune --production

FROM node:20-alpine

WORKDIR /app

# Install prisma CLI globally for running 'npx prisma db push' at runtime
# We do this globally so it doesn't inflate the local node_modules and is instantly available
RUN npm install -g prisma

# Copy pruned node_modules, build output, and prisma schema
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/prisma ./src/prisma
COPY --from=builder /app/prisma.config.ts ./

EXPOSE 8080

# Run prisma db push before starting the application
CMD ["sh", "-c", "npx prisma db push && node dist/src/main"]
