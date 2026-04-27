import express from 'express';
import { getLogin, getSignUp, loginUser, registerUser, logoutUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/login', getLogin);
router.post('/login', loginUser);
router.get('/logout', logoutUser);

router.get('/register', getSignUp);
router.post('/register', registerUser);

export default router;