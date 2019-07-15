FROM keymetrics/pm2:latest-alpine

RUN mkdir -p /usr/share/microservices
ADD . /usr/share/microservices
WORKDIR /usr/share/microservices

RUN npm i
RUN ./node_modules/.bin/ts-node ./fuse.ts
ENV NODE_ENV production
ENV PORT 8080

EXPOSE 8080

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]
