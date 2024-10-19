import { Router } from 'express';
import authMiddleware from '../middleware/auth.js';
import {registerUser, loginUser, getMe} from "../controllers/authController.js"

const router = Router();

// Register
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);

// Get user info (Authenticated route)
router.get('/me', authMiddleware, getMe);

export default router;
