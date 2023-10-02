import express from 'express';
const router = express.Router();
import { login, register } from '../controllers/users';

router.post('/login', login);
router.post('/register', register);

export default router;
