import express, { Express, Request, Response } from 'express';
import { createServer } from 'http';
import { setupSocketIO } from './socket';

// setup express and socketio
const app: Express = express();
const httpServer = createServer(app);
setupSocketIO(httpServer);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello From Server');
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));