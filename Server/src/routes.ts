import { Router } from 'express';
import { runTestCases } from './controllers';

export const rootRouter = Router();

rootRouter.post('/submission', runTestCases);
