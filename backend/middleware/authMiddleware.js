// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

// Middleware to authenticate JWT token
export const authenticateToken = (req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET;  // Make sure JWT_SECRET is set in your .env file

  const token = req.cookies.session_token; // Get token from session cookie

  if (!token) {
    return res.status(401).json({ message: 'Access denied: No token provided' });
  }

  // Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = decoded; // Attach user info to request object
    next(); // Proceed to next middleware/route handler
  } catch (error) {
    console.error('Invalid or expired token:', error);
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Middleware to ensure the user is an admin
export const authenticateAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();  // Proceed to the next middleware or route handler
};
