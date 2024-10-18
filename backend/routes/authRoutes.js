// routes/authRoutes.js
import express from 'express';
import { login, register, logout, getCurrentUser } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const authRoutes = express.Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.post('/logout', logout);
authRoutes.get('/me', authenticateToken, getCurrentUser);

export default authRoutes;
