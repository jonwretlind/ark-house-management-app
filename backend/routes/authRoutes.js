// routes/authRoutes.js
import express from 'express';
import { getCurrentUser, login, register } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Get the current logged-in user's info
router.get('/me', authenticateToken, getCurrentUser);  // Route to get current user info

export default router;
