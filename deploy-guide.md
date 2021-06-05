# Deploy guide for prisma with a GraphQL server.

This is written for a backend using Node-GraphQL, PostgreSQL and Redis and deploying it using docker.

////// First stop running redis and postgres //////

Redis

```bash
/etc/init.d/redis-server stop
```

PostgreSQL

```bash
sudo service postgresql stop
```

First lets get the images that we will require.

1. Postgres

    ```bash
    sudo docker pull postgres
    ```

    or

    ```bash
    docker pull postgres
    ```

    if you are already root user

2. Redis

    ```bash
    sudo docker pull redis
    ```

    or

    ```bash
    docker pull redis
    ```

    if you are already root user

Once you have these install you can verify that by running,

```bash
sudo docker images
```

You should have these two downloaded successfully

### Postgres

![postgres-redis](https://i.ibb.co/M5TMjvf/postgres.png)

### Redis

![postgres-redis](https://i.ibb.co/6HN3G2D/redis.png)

Now lets create an image for our server too, so navigate to root of you server directory and build a docker image of it, by running

```bash
sudo docker build . -t <name-of-image>
```

I will call it onlyauth

```bash
sudo docker build . -t onlyauth
```

Now currently no container is running, but just spinning up the server image won't work because we need to make it talk to postgres and redis images, this is where `docker-compose` comes in.

Now create a file, `docker-compose.yml` this contain config about how to link images,

```yml
services:
    redisdb:
        image: redis
        ports:
            - '6379:6379'
    db:
        image: postgres
        environment:
            POSTGRES_PASSWORD: secret
            POSTGRES_USER: postgres
            POSTGRES_DB: onlyauth
        volumes:
            - ./pgdata:/var/lib/postgresql/data
        ports:
            - '5432:5432'
    web:
        image: onlyauth
        depends_on:
            - db
            - redisdb
        ports:
            - '4000:4000'
```

This is what I used in in this case of only-auth, this file is mostly self explanatory, the point to keep in mind is that our server will use the postgres and redis services by hostname of what we name those services with.

like here the postgres service will have a hostname = db, for our server running in docker, while for our main machine it is still localhost.

so postgres db url will now be:

`postgresql://postgres:secret@db:5432/onlyauth?schema=public`

`postgresql://POSTGRES_USER:POSTGRES_PASSWORD@<service-name>/POSTGRES_DB?schema=public`

similarly, for redis it will be

`redis://redisdb:6379`

These URL's are stored on .env file

Now we need to add some extra scripts.
So, how prisma works is it needs to make migrations to DB followed by generating a Prisma Client and finally starts the server, which boils down to

```json
{
    "start": "node dist/index"
}
```

```bash
npx prisma migrate deploy && npx prisma generate && yarn start
```

adding this script,

```json
{
    "start": "node dist/index",
    "dd": "sleep 3s && npx prisma migrate deploy && npx prisma generate && yarn start"
}
```

I prefer pausing it for 3s.
and run the same script in Dockerfile

```Dockerfile
FROM node:14

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

# this is to give prisma writting rights for prisma client
RUN chmod -R 777 /usr/src
RUN yarn
RUN chmod -R 777 /usr/src

COPY . .

ENV NODE_ENV production

EXPOSE 4000

CMD [ "yarn", "dd" ]
# CMD [ "node", "dist/index" ]
USER node
```

Now again build the image,

```bash
sudo docker build . -t onlyauth
```

now run,

```bash
docker-compose up -d
```

This should spin up all the three containers and now its deployed.

In case something goes wrong, you can check logs using

```bash
docker-compose logs
```

If everything went well you should see three images on running,

```bash
docker ps
```

![list](https://i.ibb.co/MDr1YLG/dockerps.png)

And your server is up at localhost:4000
