import express from 'express';
import { createMessage, getMessages, getActiveMessage, getRecentMessage, markMessagesAsViewed, checkUnviewedMessages } from '../controllers/messageController.js';
import { authenticateToken, authenticateAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, authenticateAdmin, createMessage);
router.get('/', authenticateToken, getMessages);
router.get('/active', authenticateToken, getActiveMessage);
router.get('/recent', authenticateToken, getRecentMessage);
router.post('/mark-viewed', authenticateToken, markMessagesAsViewed);
router.get('/unviewed', authenticateToken, checkUnviewedMessages);

export default router;
