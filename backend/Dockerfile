# Production Dockerfile for Feasto Backend API
# Multi-stage build using Node.js 20 Alpine for minimal attack surface

FROM node:20-alpine AS dependencies
WORKDIR /usr/src/app

# Install production dependencies reproducibly
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Production runner stage
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PORT=4000
ENV HOST=0.0.0.0

# Copy installed production node_modules from builder stage
COPY --chown=node:node --from=dependencies /usr/src/app/node_modules ./node_modules

# Copy application source files
COPY --chown=node:node package.json server.js ./
COPY --chown=node:node config ./config
COPY --chown=node:node controllers ./controllers
COPY --chown=node:node middleware ./middleware
COPY --chown=node:node models ./models
COPY --chown=node:node routes ./routes
COPY --chown=node:node seed ./seed

# Run as non-root user
USER node

EXPOSE 4000

# Container healthcheck using Node built-in fetch
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:' + (process.env.PORT || 4000) + '/api/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]

