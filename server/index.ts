import express from 'express';
import { createServer } from 'http';
import { setupSocketIO } from './socket';
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import connectDB from './config/connectDb';
import corsMiddleware from './middlewares/corsMiddleware';
import sessionMiddleware from './middlewares/sessionMiddleware';
import { swaggerMiddleware } from './middlewares/swaggerSetup';
import * as dotenv from 'dotenv';
dotenv.config();

// Middlewares
const app = express();
app.set('trust proxy', 1);
app.use(express.json());
app.use(corsMiddleware);
app.use(sessionMiddleware);

// Routes
app.use('/users/', userRoutes);
app.use('/auth/', authRoutes);
app.use(process.env.PRODUCTION === 'false' ? swaggerMiddleware() : (req, res, next) => next());

// Database setup
connectDB();

// SocketIO server setup
const httpServer = createServer(app);
setupSocketIO(httpServer);

// Express server setup
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}🚀`);
});
