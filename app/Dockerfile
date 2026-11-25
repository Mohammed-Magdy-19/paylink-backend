# Stage 1: Install all dependencies and compile TypeScript
FROM node:22.19.0-alpine3.21 AS builder

WORKDIR /app

# Copy manifests first to leverage Docker layer caching
COPY package.json package-lock.json tsconfig.json ./
RUN npm ci

# Copy application source and compile to dist/
COPY src ./src
RUN npm run build

# Stage 2: Minimal production image running as non-root user
FROM node:22.19.0-alpine3.21 AS runner

WORKDIR /app
ENV NODE_ENV=production

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled output from builder stage
COPY --from=builder /app/dist ./dist

# Run as the built-in non-root 'node' user
USER node

EXPOSE 3000

CMD ["node", "dist/main.js"]
