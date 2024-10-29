import express from 'express';
import { 
    getAllTasks, 
    createTask, 
    updateTask, 
    deleteTask, 
    getTaskById,
    updateTaskPriorities,
    completeTask,
    assignTask,
    unassignTask,
    approveTask,
    getCompletedTasks
} from '../controllers/taskController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);

// Special task operations - put these BEFORE the generic routes
router.put('/update-priorities', updateTaskPriorities);
router.put('/:id/complete', completeTask);
router.put('/:id/assign', assignTask);
router.put('/:id/unassign', unassignTask);
router.put('/:id/approve', approveTask);
router.get('/completed', getCompletedTasks);

// Basic CRUD routes
router.get('/', getAllTasks);
router.post('/', createTask);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
