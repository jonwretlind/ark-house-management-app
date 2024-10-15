// routes/leaderboard.js
import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import Leaderboard from '../models/Leaderboard.js';
import User from '../models/User.js';

const router = express.Router();

// Get the current week's leaderboard
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Find the leaderboard for the current week
    const leaderboard = await Leaderboard.find({ week: { $gte: startOfWeek(new Date()) } })
      .populate('userId', 'name')
      .sort({ totalPoints: -1 });

    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch leaderboard', error });
  }
});

// Utility function to get the start of the week (Monday)
function startOfWeek(date) {
  const day = date.getDay(); // Sunday = 0, Monday = 1, etc.
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(date.setDate(diff));
}

export default router;
