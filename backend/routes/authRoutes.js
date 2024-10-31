// routes/authRoutes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Validate input
        if (!username || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email: username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create token with ALL user data needed for authentication
        const tokenPayload = {
            id: user._id,
            email: user.email,
            isAdmin: user.isAdmin,  // Critical for admin checks
            name: user.name
        };

        console.log('Creating token with payload:', tokenPayload); // Debug log

        const token = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Verify token immediately after creation
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Verified token contains:', decoded); // Debug log

        // Set cookie
        res.cookie('session_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        // Send response
        res.json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                accountBalance: user.accountBalance
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get current user route
router.get('/me', authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    res.clearCookie('session_token');
    res.json({ message: 'Logged out successfully' });
});

// Add this temporary debug route
router.get('/debug-user', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      databaseUser: user,
      requestUser: req.user,
      token: req.cookies.session_token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
