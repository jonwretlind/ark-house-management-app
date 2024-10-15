// routes/taskRoutes.js
import express from 'express';
import { authenticateToken, authenticateAdmin } from '../middleware/authMiddleware.js';
import { createTask, updateTask, deleteTask, completeTask, verifyTask } from '../controllers/taskController.js';

const router = express.Router();

// Admin routes (Create, update, delete tasks)
router.post('/', authenticateToken, authenticateAdmin, createTask);
router.put('/:taskId', authenticateToken, authenticateAdmin, updateTask);
router.delete('/:taskId', authenticateToken, authenticateAdmin, deleteTask);

// Non-admin (resident) routes (Sign up for tasks, complete tasks)
router.put('/complete/:taskId', authenticateToken, completeTask);

// Admin route to verify completed tasks
router.put('/verify/:taskId', authenticateToken, authenticateAdmin, verifyTask);

export default router;
