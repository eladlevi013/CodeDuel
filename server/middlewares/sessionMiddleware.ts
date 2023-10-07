import session from 'express-session'
import MongoStore from 'connect-mongo'

export default session({
    secret: process.env.SESSION_SECRET_KEY as string,
    resave: true,
    saveUninitialized: true,
    name: 'sessionServer',
    cookie: {
        secure: process.env.PRODUCTION === 'true' ? true : false,
        httpOnly: true,
        maxAge: 2592000000,
        sameSite: process.env.PRODUCTION === 'true' ? 'none' : 'lax',
        },
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
})