import express from 'express';
import { 
  createTask, getAllTasks, getTaskById, updateTask, deleteTask 
} from '../controllers/taskController.js';
import { authenticateToken, authenticateAdmin } from '../middleware/authMiddleware.js';

const taskRoutes = express.Router();

// Get all tasks (protected, admin-only route)
taskRoutes.get('/', authenticateToken, getAllTasks);

// Get task by ID (protected route)
taskRoutes.get('/:id', authenticateToken, getTaskById);

// Create a new task (admin-only)
taskRoutes.post('/', authenticateToken, authenticateAdmin, createTask);

// Update a task (admin-only)
taskRoutes.put('/:id', authenticateToken, authenticateAdmin, updateTask);

// Delete a task (admin-only)
taskRoutes.delete('/:id', authenticateToken, authenticateAdmin, deleteTask);

export default taskRoutes;
