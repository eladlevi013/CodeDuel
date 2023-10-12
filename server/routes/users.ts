import express from 'express';
const router = express.Router();
import { getScore, login, register, logout, getLeaderboard } from '../controllers/users';
import { isAuthenticated } from '../middlewares/authMiddleware';

// Routes
router.post('/login', login);
router.post('/register', register);
router.post('/logout', isAuthenticated, logout);
router.get('/score', isAuthenticated, getScore);
router.get('/leaderboard', getLeaderboard);

export default router;