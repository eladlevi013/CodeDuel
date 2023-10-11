import session from 'express-session';
import MongoStore from 'connect-mongo';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';

const getStore = (): session.Store => {
    if (process.env.PRODUCTION === 'true') {
        return new MongoStore({ mongoUrl: process.env.MONGO_URL });
    } else {
        // Initialize Redis client.
        let redisClient = createClient();
        redisClient.connect().catch(console.error);

        // Initialize and return Redis store.
        return new (RedisStore as any)({
            client: redisClient,
            prefix: 'codeduel:'
        });        
    }
};

const sessionConfig: session.SessionOptions = {
    secret: process.env.SESSION_SECRET_KEY as string,
    resave: false,
    saveUninitialized: false,
    name: 'sessionServer',
    cookie: {
        secure: process.env.PRODUCTION === 'true' ? true : false,
        httpOnly: true,
        maxAge: 2592000000,
        sameSite: process.env.PRODUCTION === 'true' ? 'none' : 'lax',
    },
    store: getStore(),
};

export default session(sessionConfig);
