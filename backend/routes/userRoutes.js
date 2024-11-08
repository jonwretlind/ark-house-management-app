import express from 'express';
import User from '../models/User.js';
import { authenticateUser } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';

const router = express.Router();

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads/avatars');
    cb(null, uploadPath);
  },
  filename: function(req, file, cb) {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images are allowed!'));
  }
});

// Apply authentication middleware to all routes
router.use(authenticateUser);

// Get leaderboard - put this BEFORE the :id route
router.get('/leaderboard', async (req, res) => {
    try {
        const users = await User.find()
            .select('name accountBalance avatarUrl')
            .sort({ accountBalance: -1 });

        // Format the avatar URLs before sending
        const formattedUsers = users.map(user => ({
            ...user.toObject(),
            avatarUrl: user.avatarUrl ? `/api/uploads/${user.avatarUrl.replace(/^\/?(api\/)?(uploads\/)?/, '')}` : null
        }));

        res.json(formattedUsers);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all users (protected, admin only)
router.get('/', authenticateUser, async (req, res) => {
  try {
    console.log('GET /users - Authenticated user:', req.user);
    
    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (!user?.isAdmin) {
      console.log('Non-admin user attempted to access users list');
      return res.status(403).json({ message: 'Admin access required' });
    }

    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error in GET /users:', error);
    res.status(500).json({ 
      message: 'Error fetching users',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get single user by ID
router.get('/:id', async (req, res) => {
    try {
        // Validate if id is a valid ObjectId
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        const user = await User.findById(req.params.id).select('name email');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/profile', authenticateUser, async (req, res) => {
  try {
    const { name, email, phone, birthday } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.birthday = birthday || user.birthday;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

router.post('/avatar', authenticateUser, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user._id);
    // Store the path relative to uploads directory
    const avatarUrl = `avatars/${req.file.filename}`;
    user.avatarUrl = avatarUrl;
    await user.save();

    console.log('Avatar uploaded:', {
      filename: req.file.filename,
      savedUrl: avatarUrl,
      fullUrl: `/api/uploads/${avatarUrl}`
    });

    // Return the full URL path with /api prefix
    res.json({ avatarUrl: `/api/uploads/${avatarUrl}` });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ message: 'Error uploading avatar', error: error.message });
  }
});

router.put('/change-password', authenticateUser, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Validate new password
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    // Update password
    user.passwordHash = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating password', error: error.message });
  }
});

// Update the profile route
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Format the avatar URL if it exists
    if (user.avatarUrl) {
      // Ensure the URL starts with /api/uploads/
      user.avatarUrl = `/api/uploads/${user.avatarUrl.replace(/^\/?(api\/)?(uploads\/)?/, '')}`;
    }

    console.log('Sending user profile:', {
      userId: user._id,
      avatarUrl: user.avatarUrl
    });

    res.json(user);
  } catch (error) {
    console.error('Error in profile route:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

export default router;
