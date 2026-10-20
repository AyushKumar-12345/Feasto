# Production Dockerfile for Feasto Customer Frontend
# Multi-stage build: Node.js 20 build -> Nginx Alpine static server

FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Build-time environment variables for Vite SPA bundle
ARG VITE_BACKEND_URL=http://localhost:4000
ARG VITE_ADMIN_URL=http://localhost:5174
ARG VITE_RAZORPAY_KEY_ID=
ARG VITE_FORMSPREE_FORM_ID=

ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_ADMIN_URL=$VITE_ADMIN_URL
ENV VITE_RAZORPAY_KEY_ID=$VITE_RAZORPAY_KEY_ID
ENV VITE_FORMSPREE_FORM_ID=$VITE_FORMSPREE_FORM_ID

RUN npm run build

# Nginx static runtime stage
FROM nginx:alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

