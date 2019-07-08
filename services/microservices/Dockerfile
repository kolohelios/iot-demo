FROM keymetrics/pm2:latest-alpine

WORKDIR /usr/share/microservices
ENV NODE_ENV development
CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]
