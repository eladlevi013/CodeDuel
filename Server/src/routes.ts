import { Router } from 'express';
import { executeCode } from './controllers';

export const rootRouter = Router();

rootRouter.get('/', executeCode);
