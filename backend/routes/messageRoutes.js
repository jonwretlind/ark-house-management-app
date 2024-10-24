import express from 'express';
import { createMessage, getMessages } from '../controllers/messageController.js';
import { authenticateToken, authenticateAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, authenticateAdmin, createMessage);
router.get('/', authenticateToken, getMessages);

export default router;
