import express from 'express';
import { createEvent, getEvents, markEventsAsViewed, rsvpEvent, getMyEvents } from '../controllers/eventController.js';
import { authenticateToken, authenticateAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, authenticateAdmin, createEvent);
router.get('/', authenticateToken, getEvents);
router.post('/mark-viewed', authenticateToken, markEventsAsViewed);
router.post('/:id/rsvp', authenticateToken, rsvpEvent);
router.get('/my-events', authenticateToken, getMyEvents);

export default router;
