import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { setupSocketIO } from './socket';
import userRoutes from './routes/users';
import connectDB from './config/connectDb';
import session from 'express-session';
import MongoStore from 'connect-mongo';
dotenv.config();

// Middlewares
const app = express();
app.use(express.json());
app.use(cors());
app.use(
    session({
      secret: 'your_secret_key',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: 'auto', maxAge: 2592000000 },
      store: MongoStore.create({ mongoUrl: process.env.MONGO_URL })
    })
);
app.use('/users/', userRoutes)

// Database setup
connectDB();

// Socketio setup
const httpServer = createServer(app);
setupSocketIO(httpServer);

// Server setup
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
