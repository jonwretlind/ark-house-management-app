// routes/authRoutes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticateUser } from '../middleware/auth.js';
import Group from '../models/Group.js';

const router = express.Router();

const serializeUser = (userDoc) => ({
  _id: userDoc._id,
  id: userDoc._id,
  name: userDoc.name,
  email: userDoc.email,
  phone: userDoc.phone || '',
  role: userDoc.role,
  isAdmin: userDoc.isAdmin,
  isSuperAdmin: userDoc.role === 'superadmin',
  accountBalance: userDoc.accountBalance || 0,
  group: userDoc.groupId
    ? {
        id: userDoc.groupId._id,
        name: userDoc.groupId.name,
        code: userDoc.groupId.code,
        location: userDoc.groupId.location || ''
      }
    : null,
  avatarUrl: userDoc.avatarUrl || null
});

// GET /api/auth/me - Get current user
router.get('/me', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-passwordHash')
      .populate('groupId', 'name code location isActive');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(serializeUser(user));
  } catch (error) {
    console.error('Error in /me route:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/auth/login - Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password, groupCode } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedGroupCode = groupCode ? groupCode.trim().toLowerCase() : null;

    let group = null;
    if (normalizedGroupCode) {
      group = await Group.findOne({ code: normalizedGroupCode, isActive: true });
      if (!group) {
        return res.status(401).json({ message: 'Invalid group code' });
      }
    }

    const loginQuery = {
      email: normalizedEmail,
      ...(group ? { groupId: group._id } : {})
    };

    const candidates = await User.find(loginQuery)
      .populate('groupId', 'name code location isActive')
      .limit(5);

    if (!candidates.length) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!group && candidates.length > 1) {
      return res.status(409).json({
        message: 'Multiple users found for this email. Provide groupCode to log in.',
        requiresGroupCode: true,
        groups: candidates
          .filter(candidate => candidate.groupId)
          .map(candidate => ({
            id: candidate.groupId._id,
            name: candidate.groupId.name,
            code: candidate.groupId.code
          }))
      });
    }

    const user = candidates[0];

    if (user.role !== 'superadmin' && !user.groupId) {
      return res.status(403).json({ message: 'User is not assigned to a group' });
    }

    try {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Password comparison error:', error);
      return res.status(500).json({ message: 'Error verifying credentials' });
    }

    const tokenPayload = {
      id: user._id,
      role: user.role,
      isAdmin: user.isAdmin,
      groupId: user.groupId?._id || null
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set cookie with specific options
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/'
    });

    res.json({
      user: serializeUser(user)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Error logging in',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/auth/logout - Logout user
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// POST /api/auth/register - Register user (superadmin or admin within own group)
router.post('/register', authenticateUser, async (req, res) => {
  try {
    const { name, email, phone, password, role = 'resident', groupId } = req.body;

    if (!req.auth?.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    let targetRole = role;
    if (!['resident', 'admin', 'superadmin'].includes(targetRole)) {
      targetRole = 'resident';
    }

    if (!req.auth.isSuperAdmin && targetRole === 'superadmin') {
      return res.status(403).json({ message: 'Only superadmin can create superadmin users' });
    }

    let targetGroupId = req.auth.groupId;
    if (req.auth.isSuperAdmin) {
      if (targetRole !== 'superadmin') {
        if (!groupId) {
          return res.status(400).json({ message: 'groupId is required for non-superadmin users' });
        }
        const group = await Group.findById(groupId);
        if (!group || !group.isActive) {
          return res.status(400).json({ message: 'Invalid or inactive group' });
        }
        targetGroupId = group._id;
      } else {
        targetGroupId = null;
      }
    }

    if (targetRole !== 'superadmin' && !targetGroupId) {
      return res.status(400).json({ message: 'A group is required for resident/admin users' });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
      ...(targetGroupId ? { groupId: targetGroupId } : { role: 'superadmin' })
    });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists for this group' });
    }

    const newUser = new User({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone || '',
      passwordHash: password,
      role: targetRole,
      groupId: targetGroupId
    });

    const savedUser = await newUser.save();
    const populatedUser = await User.findById(savedUser._id)
      .select('-passwordHash')
      .populate('groupId', 'name code location isActive');

    res.status(201).json({ user: serializeUser(populatedUser) });
  } catch (error) {
    console.error('Error in /register route:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

export default router;
