FROM node:20

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN chown -R node:node /usr/src/app
RUN npm ci --only=production

ENV DEBUG=playground:*
ENV NODE_ENV=production

USER node

CMD ["npm", "start"]
