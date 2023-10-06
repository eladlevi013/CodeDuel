import session from 'express-session'
import MongoStore from 'connect-mongo'

export default session({
    secret: process.env.SESSION_SECRET_KEY as string,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true, httpOnly: true, maxAge: 2592000000 },
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
})