FROM node:20.11.0-alpine AS build

WORKDIR /usr/src/app

COPY package.json yarn*.lock ./

RUN yarn install --pure-lockfile

COPY . .

FROM node:20.11.0-alpine AS final

WORKDIR /usr/src/app

EXPOSE 9000

COPY --from=build /usr/src/app ./

USER node

ENV YARN_CMD=${YARN_CMD}

CMD $YARN_CMD