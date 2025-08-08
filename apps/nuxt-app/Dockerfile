# Nuxt.js Production Dockerfile
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.4.0 --activate

# Copy package files (从根目录构建时的路径)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json config.ts tsconfig.json ./
COPY apps/nuxt-app/package.json ./apps/nuxt-app/
COPY libs ./libs

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the source code
FROM base AS builder
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.4.0 --activate

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/libs ./libs

# Copy source code
COPY apps/nuxt-app ./apps/nuxt-app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json config.ts tsconfig.json ./

# Build the application
ENV BUILD_TIME=true
RUN pnpm build:nuxt

# Production image, copy all the files and run nuxt
FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nuxtjs

# Copy built application
COPY --from=builder /app/apps/nuxt-app/.output ./apps/nuxt-app/.output

# Set correct permissions
RUN chown -R nuxtjs:nodejs /app
USER nuxtjs

EXPOSE 7001

ENV PORT=7001
ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=7001

# Start the application
CMD ["node", "apps/nuxt-app/.output/server/index.mjs"] 