import express from 'express';
import { createServer } from 'http';
import { setupSocketIO } from './socket';
import userRoutes from './routes/users';
import connectDB from './config/connectDb';
import corsMiddleware from './middlewares/corsMiddleware';
import sessionMiddleware from './middlewares/sessionMiddleware';
import * as dotenv from 'dotenv';
dotenv.config();

// Middlewares 
const app = express();
app.set('trust proxy', 1);
app.use(express.json());
app.use(corsMiddleware);
app.use(sessionMiddleware);
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
