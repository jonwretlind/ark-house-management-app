import express from 'express';
import Task from '../models/Task.js'; // Make sure this import is correct
import { 
  createTask, getAllTasks, getTaskById, updateTask, deleteTask, updateTaskPriorities, completeTask, assignTask
} from '../controllers/taskController.js';
import { authenticateToken, authenticateAdmin } from '../middleware/authMiddleware.js';
import mongoose from 'mongoose';

const taskRoutes = express.Router();

// Update task priorities (admin-only) - This should be before the /:id routes
taskRoutes.put('/update-priorities', authenticateToken, authenticateAdmin, updateTaskPriorities);

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

// Add these new routes to the existing taskRoutes.js file

taskRoutes.put('/:id/complete', authenticateToken, completeTask);
taskRoutes.put('/:id/assign', authenticateToken, assignTask);

export default taskRoutes;
