import express from 'express';
import { 
    getAllMessages,
    createMessage,
    updateMessage,
    deleteMessage,
    getActiveMessage,
    getRecentMessage,
    getUnviewedMessages,
    markMessagesAsViewed
} from '../controllers/messageController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateUser);

// Admin routes
router.post('/', createMessage);  // Create new message
router.put('/:id', updateMessage);  // Update message
router.delete('/:id', deleteMessage);  // Delete message

// General routes
router.get('/', getAllMessages);  // Get all messages
router.get('/active', getActiveMessage);  // Get currently active message
router.get('/recent', getRecentMessage);  // Get most recent message
router.get('/unviewed', getUnviewedMessages);  // Check for unviewed messages
router.post('/mark-viewed', markMessagesAsViewed);  // Mark messages as viewed

export default router;
