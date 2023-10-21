import express from 'express';
const router = express.Router();
import { login, register, logout } from '../controllers/auth';
import { isAuthenticated } from '../middlewares/authMiddleware';

// Routes
router.post('/login', login);
router.post('/register', register);
router.post('/logout', isAuthenticated, logout);

export default router;
