FROM node:lts-alpine as base
RUN npm i-g corepack@latest
RUN corepack enable pnpm

#layer dependências
FROM base As dependences 

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./

RUN npm install --omit=dev

#layer runner
FROM base As runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

RUN chown nodejs:nodejs /app api:nodejs .

COPY --chown=api:nodejs . .
COPY --from=dependences /app/node_modules ./node_modules

USER  api

EXPOSE 3333

ENV PORT=3333

ENV HOSTNAME = "0.0.0.0"

ENTRYPOINT [ "npm", "run", "start" ]

