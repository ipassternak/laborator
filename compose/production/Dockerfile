FROM node:22-alpine as build
WORKDIR /tmp/
COPY package.json package-lock.json tsconfig.json ./
RUN npm install
COPY src/ src/
COPY prisma/schema.prisma prisma/schema.prisma
RUN npx prisma generate
RUN npm run build -- --sourceMap false
RUN npm prune --production

FROM node:22-alpine
WORKDIR /app
COPY --from=build /tmp/node_modules/ ./node_modules/
COPY --from=build /tmp/dist/ ./dist/
COPY --from=build /tmp/package.json ./package.json
USER node
CMD ["node", "dist/server.js"]