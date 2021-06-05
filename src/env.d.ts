declare namespace NodeJS {
    interface ProcessEnv {
        COOKIE_SECRET: string;
        PORT: string;
        REDIS_URL: string;
        DATABASE_URL: string;
    }
}
