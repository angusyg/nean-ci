FROM node:alpine

# Build args
ARG APP_NAME nean-ci
ARG APP_REPOSITORY https://github.com/angusyg/nean-ci
ARG GITHUB_SECRET GithubSecret

RUN apk add --no-cache \
  git \
  openssh \
  python \
  make \
  g++

USER node

# Install pm2
RUN npm install pm2 -g

# Install pm2 log rotate and configure it
RUN pm2 install pm2-logrotate
RUN pm2 set pm2-logrotate:max_size 10M
RUN pm2 set pm2-logrotate:retain 10
RUN pm2 set pm2-logrotate:compress true
RUN pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss
RUN pm2 set pm2-logrotate:rotateModule true
RUN pm2 set pm2-logrotate:workerInterval 30
RUN pm2 set pm2-logrotate:rotateInterval '0 0 * * *'

# Install pm2 github webhook to pull new version when master is updated
RUN pm2 install pm2-githook
RUN pm2 set pm2-githook:port 8888
RUN pm2 set pm2-githook:apps "{\"${APP_NAME}\":{\"service\":\"github\",\"branch\":\"master\",\"secret\":\"${GITHUB_SECRET}\",\"prehook\":\"npm install\",\"posthook\":\"echo done\"}}"

WORKDIR /usr/src

# App cloning
RUN git clone ${APP_REPOSITORY} app

WORKDIR /usr/src/app

# App checkout master branch
RUN git checkout master

ENV NODE_ENV production
ENV PORT 3000
ENV LOG_LEVEL info
ENV LOG_FOLDER /usr/src/app/log
ENV BUILD_FOLDER /usr/src/app/build
ENV GITHUB_XHUB_ALGORITHM sha1
ENV PM2 true

# App install
RUN npm install

# Expose app port and pm2 ports
EXPOSE ${PORT} 8888

# Monitor app with pm2
CMD ["pm2-runtime", "--json", "start", "pm2.config.js"]
