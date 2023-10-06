import session from 'express-session'
import MongoStore from 'connect-mongo'

export default session({
    secret: process.env.SESSION_SECRET_KEY as string,
    resave: false,
    saveUninitialized: false,
    name: 'sessionServer',
    cookie: {
        secure: true,
        httpOnly: true,
        maxAge: 2592000000,
        sameSite: 'none',
        },
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
})