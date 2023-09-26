import express, { Express, Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app: Express = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

interface Room {
  players: string[];
}

// Map of room codes to room objects
const rooms = new Map<string, Room>();

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => console.log('user disconnected'));
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));