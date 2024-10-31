// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

// Middleware to authenticate JWT token
export const authenticateToken = (req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET;  // Make sure JWT_SECRET is set in your .env file

  const token = req.cookies.session_token; // Get token from session cookie

  console.log('Token received:', token); // Debug log

  if (!token) {
    return res.status(401).json({ message: 'Access denied: No token provided' });
  }

  // Verify the token
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token:', decoded);

    // Set ONLY the necessary authentication data
    req.user = {
      id: decoded.id,
      email: decoded.email,
      isAdmin: decoded.isAdmin
    };

    console.log('User set in request:', req.user);
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Middleware to ensure the user is an admin
export const authenticateAdmin = (req, res, next) => {
  console.log('Full request user object:', req.user); // Debug log
  console.log('isAdmin value:', req.user?.isAdmin); // Debug log
  console.log('Type of isAdmin:', typeof req.user?.isAdmin); // Debug log
  
  if (!req.user || req.user.isAdmin !== true) {  // Strict comparison
    return res.status(403).json({ 
      message: 'Access denied: Admins only',
      debug: {
        user: req.user,
        isAdmin: req.user?.isAdmin,
        type: typeof req.user?.isAdmin
      }
    });
  }
  next();  // Proceed to the next middleware or route handler
};
