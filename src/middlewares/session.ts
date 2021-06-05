import connectRedis from 'connect-redis';
import session from 'express-session';
import redis from 'redis';
import { $10_YEARS, COOKIE_NAME, __prod__ } from '../constants';

const RedisStore = connectRedis(session);
const redisClient = redis.createClient({ url: process.env.REDIS_URL });

const sessionStore = new RedisStore({
    client: redisClient,
    disableTouch: true,
});

export function sessionMiddleware(SECRET: string) {
    return session({
        name: COOKIE_NAME,
        store: sessionStore,
        secret: SECRET,
        cookie: {
            maxAge: $10_YEARS,
            httpOnly: true,
            sameSite: 'lax',
            secure: __prod__,
        },
        saveUninitialized: false,
        resave: false,
    });
}
