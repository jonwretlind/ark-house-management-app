// controllers/authController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';


// Register Function
export const register = async (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET;

  const { name, email, phone, password, isAdmin } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user instance
    const newUser = new User({
      name,
      email,
      phone,
      passwordHash: password, // Password will be hashed in the pre-save hook
      isAdmin,
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Generate a JWT token
    const token = jwt.sign(
      { id: savedUser._id, email: savedUser.email, isAdmin: savedUser.isAdmin },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Set the session cookie
    res.cookie('session_token', token, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour
      sameSite: 'Strict',
    });

    // Send the response with the user details
    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        phone: savedUser.phone,
        isAdmin: savedUser.isAdmin,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// Login Function
export const login = async (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET; // Ensure this is loaded correctly

  const { email, password } = req.body;

  try {
    console.log('Received login request:', req.body);
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Set the session cookie
    res.cookie('session_token', token, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour
      sameSite: 'Strict',
    });

    // Send the response
    res.status(200).json({
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// Logout Function
export const logout = (req, res) => {
  res.clearCookie('session_token');
  res.status(200).json({ message: 'Logged out successfully' });
};

// Get Current User
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
