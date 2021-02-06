## Description

Bacis backend gateway to experiment with nestjs.

### Features
+ Swagger -> /api
+ JWT access and refresh token in cookies
+ rest-api
+ postgresql with typeorm

## Installation

```bash
$ npm install
```

## Running the app
declare `.env` and `docker.env` files with following enviroment variables:
+ NESTJS
  + `DATABASE_URL`
  + `PORT`
  + `JWT_ACCESS_TOKEN_SECRET`*
  + `JWT_ACCESS_TOKEN_EXPIRATION_TIME`*
  + `JWT_REFRESH_TOKEN_SECRET`*
  + `JWT_REFRESH_TOKEN_EXPIRATION_TIME`*
  + `NODE_ENV`*

+ DOCKER
  + `POSTGRES_USER`
  + `POSTGRES_PASSWORD`
  + `POSTGRES_DB`
  + `PGADMIN_DEFAULT_EMAIL`
  + `PGADMIN_DEFAULT_PASSWORD`

```bash
# run postgres in container
$ sudo docker-compose up

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Deploy on Heroku

```bash
# add heroku remote  if not added yet
$ heroku git:remove -a <APP_NAME>
# add enviroment variables(all the variable for NESTJS marked with '*')
$ heroku config:set <VARIABLE>=<VALUE> -a <APP_NAME>
# push and deploy
$ git push heroku master
```

## Sources
+ https://nestjs.com/
+ https://wanago.io
+  [Kelvin Mai](https://www.youtube.com/channel/UCUSpT2b4x2Bq3RcAAg4hFng)

## License

Nest is [MIT licensed](LICENSE).
