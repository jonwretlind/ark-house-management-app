// routes/task.js
import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { createTask, completeTask } from '../controllers/taskController.js';

const router = express.Router();

// Task management
router.post('/create', authenticateToken, createTask);
router.post('/complete/:id', authenticateToken, completeTask);

export default router;
