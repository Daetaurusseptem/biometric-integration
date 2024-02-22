import express from 'express';

import { login, renewToken } from '../controllers/Auth';
import { verifyToken } from '../middleware/jwt';

const router = express.Router();

router.post('/', login);
router.get('/renew', verifyToken, renewToken);


export default router;