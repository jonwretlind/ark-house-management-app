// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;  // Make sure JWT_SECRET is set in your .env file

// Middleware to authenticate JWT token
export const authenticateToken = (req, res, next) => {
  // Get token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];  // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Access denied: No token provided' });
  }

  // Verify the token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // Attach user information to the request object
    req.user = user;
    next();  // Proceed to the next middleware or route handler
  });
};

// Middleware to ensure the user is an admin
export const authenticateAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();  // Proceed to the next middleware or route handler
};
