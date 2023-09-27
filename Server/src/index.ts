import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { rootRouter } from './routes';
import { setupSocketIO } from './socket';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/', rootRouter);

const httpServer = createServer(app);
setupSocketIO(httpServer);
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
