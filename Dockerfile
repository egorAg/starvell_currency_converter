FROM node:20-alpine AS builder

WORKDIR /app

COPY app/package*.json ./
RUN npm install

COPY app/ ./

RUN npm run build


FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/main.js"]
