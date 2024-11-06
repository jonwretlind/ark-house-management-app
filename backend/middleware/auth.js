import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateUser = async (req, res, next) => {
    try {
        console.log('Auth middleware - cookies:', req.cookies);
        console.log('Auth middleware - headers:', req.headers);

        const token = req.cookies.token;
        
        if (!token) {
            console.log('No token found in cookies');
            return res.status(401).json({ message: 'No authentication token found' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Token decoded:', decoded);
            req.user = decoded;
            next();
        } catch (error) {
            console.log('Token verification failed:', error.message);
            return res.status(401).json({ message: 'Token verification failed' });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ message: 'Server error in auth middleware' });
    }
}; 