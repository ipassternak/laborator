FROM node:22-alpine as build
WORKDIR /tmp/
COPY package.json package-lock.json tsconfig.json ./
RUN npm install
COPY src/ src/
RUN npm run build && npm prune --production

FROM node:22-alpine
WORKDIR /app
COPY --from=build /tmp/node_modules/ ./node_modules/
COPY --from=build /tmp/dist/ ./dist/
COPY --from=build /tmp/package.json ./package.json
USER node
CMD ["node", "dist/server.js"]