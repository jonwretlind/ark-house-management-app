import express from 'express';
import { createEvent, getEvents, markEventsAsViewed, rsvpEvent, getMyEvents, deleteEvent, updateEvent } from '../controllers/eventController.js';
import { authenticateToken, authenticateAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, authenticateAdmin, createEvent);
router.get('/', authenticateToken, getEvents);
router.post('/mark-viewed', authenticateToken, markEventsAsViewed);
router.post('/:id/rsvp', authenticateToken, rsvpEvent);
router.get('/my-events', authenticateToken, getMyEvents);
router.delete('/:id', authenticateToken, deleteEvent);
router.put('/:id', authenticateToken, authenticateAdmin, updateEvent);

export default router;
