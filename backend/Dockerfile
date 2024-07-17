FROM node:18-alpine as builder
WORKDIR /kupipodariday-backend
COPY package*.json ./
RUN npm ci --no-audit --no-fund --legacy-peer-deps
COPY . ./
RUN npm run build


FROM node:18-alpine as runner
WORKDIR /kupipodariday-backend
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund --legacy-peer-deps\
    && npm i -g pm2
COPY --from=builder //kupipodariday-backend/dist ./dist
COPY ./ecosystem.config.js ./
ENTRYPOINT [ "pm2-runtime", "start", "ecosystem.config.js" ]