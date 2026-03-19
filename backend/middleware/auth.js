import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateUser = async (req, res, next) => {
    try {
        let token = req.cookies.token;
        if (!token && req.headers.authorization?.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ message: 'Invalid authentication token' });
        }

        const user = await User.findById(decoded.id)
            .select('-passwordHash')
            .populate('groupId', 'name code location isActive');

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        req.auth = {
            id: user._id.toString(),
            role: user.role || (user.isAdmin ? 'admin' : 'resident'),
            isAdmin: user.isAdmin === true,
            isSuperAdmin: user.role === 'superadmin',
            groupId: user.groupId?._id?.toString() || null
        };

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ message: 'Server error in auth middleware' });
    }
}; 

export const requireAdmin = (req, res, next) => {
    if (!req.auth?.isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

export const requireSuperAdmin = (req, res, next) => {
    if (!req.auth?.isSuperAdmin) {
        return res.status(403).json({ message: 'Superadmin access required' });
    }
    next();
};

export const canAccessGroup = (req, groupId) => {
    if (!groupId) return false;
    if (req.auth?.isSuperAdmin) return true;
    return req.auth?.groupId === groupId.toString();
};