import express from 'express';
const router = express.Router();
import { getScore, login, register } from '../controllers/users';

router.post('/login', login);
router.post('/register', register);
// router.post('/logout', logout);
router.get('/score', getScore);

export default router;
