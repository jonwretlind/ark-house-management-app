import express from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, getLeaderboard } from '../controllers/userController.js';
import { authenticateToken, authenticateAdmin } from '../middleware/authMiddleware.js';

const userRoutes = express.Router();

// User routes
userRoutes.get('/', authenticateToken, authenticateAdmin, getAllUsers);
userRoutes.get('/leaderboard', authenticateToken, getLeaderboard);
userRoutes.get('/:userId', authenticateToken, getUserById);
userRoutes.post('/', authenticateToken, authenticateAdmin, createUser);
userRoutes.put('/:userId', authenticateToken, authenticateAdmin, updateUser);
userRoutes.delete('/:userId', authenticateToken, authenticateAdmin, deleteUser);

export default userRoutes;
