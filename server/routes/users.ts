import express from 'express';
const router = express.Router();
import { getScore, getLeaderboard } from '../controllers/users';
import { isAuthenticated } from '../middlewares/authMiddleware';

// Routes
router.get('/score', isAuthenticated, getScore);
router.get('/leaderboard', getLeaderboard);

export default router;
