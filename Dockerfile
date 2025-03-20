FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/package*.json .
COPY --from=builder /app/dist ./dist

RUN npm ci --production

EXPOSE 3000

CMD ["node", "dist/index.js"]