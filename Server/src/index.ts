import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupSocketIO } from './socket';
dotenv.config();

// Middlewares
const app = express();
app.use(express.json());
app.use(cors());

// Socketio setup
const httpServer = createServer(app);
setupSocketIO(httpServer);

// Server setup
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
