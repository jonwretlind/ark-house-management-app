import express from 'express';
import { 
  createTask, getAllTasks, getTaskById, updateTask, deleteTask 
} from '../controllers/taskController.js';
import { authenticateToken, authenticateAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// CRUD operations
router.post('/', authenticateToken, authenticateAdmin, createTask);
router.get('/', authenticateToken, authenticateAdmin, getAllTasks);
router.get('/:id', authenticateToken, authenticateAdmin, getTaskById);
router.put('/:id', authenticateToken, authenticateAdmin, updateTask);
router.delete('/:id', authenticateToken, authenticateAdmin, deleteTask);

export default router;
