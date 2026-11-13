FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json .npmrc ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build
RUN npm prune --omit=dev --ignore-scripts

FROM node:20-alpine AS runtime
RUN apk add --no-cache dumb-init \
  && addgroup -S app \
  && adduser -S app -G app
WORKDIR /app

COPY --from=build --chown=app:app /app/dist ./dist
COPY --from=build --chown=app:app /app/dist-server ./dist-server
COPY --from=build --chown=app:app /app/node_modules ./node_modules
COPY --from=build --chown=app:app /app/package.json ./package.json

USER app
ENV NODE_ENV=production
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O - http://127.0.0.1:3000/api/health >/dev/null || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist-server/index.js"]