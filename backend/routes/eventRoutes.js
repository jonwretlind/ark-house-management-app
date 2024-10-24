import express from 'express';
import { createEvent, getEvents, markEventsAsViewed } from '../controllers/eventController.js';
import { authenticateToken, authenticateAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, authenticateAdmin, createEvent);
router.get('/', authenticateToken, getEvents);
router.post('/mark-viewed', authenticateToken, markEventsAsViewed);

export default router;
