import { Request, Response, NextFunction } from 'express';
import SessionModel from '../models/SessionModel';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const session = req.session as SessionModel;

  if (session && session.account) {
    return next();
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
