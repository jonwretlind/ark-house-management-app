import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateUser = async (req, res, next) => {
    try {
        // Get token from session_token cookie instead of jwt
        const token = req.cookies.session_token;

        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ message: 'Authentication failed' });
    }
}; 