import express from 'express';
import { 
  createTask, getAllTasks, getTaskById, updateTask, deleteTask, updateTaskPriorities, completeTask, assignTask, unassignTask, approveTask, getCompletedTasks
} from '../controllers/taskController.js';
import { authenticateToken, authenticateAdmin } from '../middleware/authMiddleware.js';

const taskRoutes = express.Router();

// Ensure this is before any routes that use /:id
taskRoutes.get('/completed', getCompletedTasks);

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
taskRoutes.put('/:id/unassign', authenticateToken, authenticateAdmin, unassignTask);
taskRoutes.put('/:id/approve', authenticateToken, authenticateAdmin, approveTask);

export default taskRoutes;
