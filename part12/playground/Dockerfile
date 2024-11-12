FROM node:20

WORKDIR /usr/src/app

USER node

COPY --chown=node:node . .

RUN npm ci --only=production

ENV DEBUG=playground:*
ENV NODE_ENV production

CMD npm start