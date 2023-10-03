import express from 'express';
const router = express.Router();
import { login, register } from '../controllers/users';

router.post('/login', login);
router.post('/register', register);
router.get('/hey', (req, res) => {
    res.send('hey');
}
);

export default router;
