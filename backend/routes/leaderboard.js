// routes/leaderboard.js
import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// Get the current week's leaderboard
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Get all users with complete profile data
    const users = await User.find({}, 'name accountBalance avatarUrl')
      .lean()  // Convert to plain JavaScript objects
      .sort({ accountBalance: -1 });

    console.log('Users from leaderboard:', users); // Debug log to see what fields are included

    res.status(200).json(users);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: 'Failed to fetch leaderboard', error });
  }
});

export default router;
