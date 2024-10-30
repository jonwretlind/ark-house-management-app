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

        // Find user by email (frontend sends username but it's actually email)
        const user = await User.findOne({ email: username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password against passwordHash
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Set cookie with correct name
        res.cookie('session_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
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

export default router;
