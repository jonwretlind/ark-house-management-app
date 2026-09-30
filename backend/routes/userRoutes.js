import express from 'express';
import User from '../models/User.js';
import { authenticateUser } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
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
  avatarUrl: userDoc.avatarUrl || null,
  accountBalance: userDoc.accountBalance || 0,
  group: userDoc.groupId
    ? {
        id: userDoc.groupId._id,
        name: userDoc.groupId.name,
        code: userDoc.groupId.code,
        location: userDoc.groupId.location || '',
        branding: userDoc.groupId.branding || null
      }
    : null
});

const canManageUser = (req, targetUser) => {
  if (req.auth?.isSuperAdmin) return true;
  if (!req.auth?.isAdmin) return false;
  return targetUser.groupId?.toString() === req.auth.groupId;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
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

router.use(authenticateUser);

router.get('/leaderboard', async (req, res) => {
  try {
    const query = {};

    if (!req.auth.isSuperAdmin) {
      query.groupId = req.auth.groupId;
    } else if (req.query.groupId) {
      query.groupId = req.query.groupId;
    }

    const users = await User.find(query)
      .select('name accountBalance avatarUrl groupId role isAdmin')
      .populate('groupId', 'name code location branding')
      .sort({ accountBalance: -1 });

    const formattedUsers = users.map((user) => ({
      ...serializeUser(user),
      avatarUrl: user.avatarUrl ? `/api/uploads/${user.avatarUrl.replace(/^\/?(api\/)?(uploads\/)?/, '')}` : null
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-passwordHash')
      .populate('groupId', 'name code location branding');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const payload = serializeUser(user);
    if (payload.avatarUrl) {
      payload.avatarUrl = `/api/uploads/${payload.avatarUrl.replace(/^\/?(api\/)?(uploads\/)?/, '')}`;
    }

    res.json(payload);
  } catch (error) {
    console.error('Error in profile route:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

router.put('/profile', async (req, res) => {
  try {
    const { name, email, phone, birthday } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (email && email.trim().toLowerCase() !== user.email) {
      const duplicate = await User.findOne({
        email: email.trim().toLowerCase(),
        groupId: user.groupId
      });
      if (duplicate) {
        return res.status(409).json({ message: 'Email already in use for this group' });
      }
      user.email = email.trim().toLowerCase();
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.birthday = birthday || user.birthday;

    await user.save();

    const populatedUser = await User.findById(user._id)
      .select('-passwordHash')
      .populate('groupId', 'name code location branding');

    res.json(serializeUser(populatedUser));
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

router.put('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    user.passwordHash = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating password', error: error.message });
  }
});

router.post('/avatar', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user._id);
    const avatarUrl = `avatars/${req.file.filename}`;
    user.avatarUrl = avatarUrl;
    await user.save();

    res.json({ avatarUrl: `/api/uploads/${avatarUrl}` });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ message: 'Error uploading avatar', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    if (!req.auth.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const query = {};
    if (!req.auth.isSuperAdmin) {
      query.groupId = req.auth.groupId;
    } else if (req.query.groupId) {
      query.groupId = req.query.groupId;
    }

    const users = await User.find(query)
      .select('-passwordHash')
      .populate('groupId', 'name code location branding');

    res.json(users.map(serializeUser));
  } catch (error) {
    console.error('Error in GET /users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

router.post('/', async (req, res) => {
  try {
    if (!req.auth.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { name, email, phone, password, role = 'resident', groupId } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const targetRole = ['resident', 'admin', 'superadmin'].includes(role) ? role : 'resident';

    if (!req.auth.isSuperAdmin && targetRole === 'superadmin') {
      return res.status(403).json({ message: 'Only superadmin can create superadmin users' });
    }

    let targetGroupId = req.auth.groupId;
    if (req.auth.isSuperAdmin) {
      if (targetRole === 'superadmin') {
        targetGroupId = null;
      } else {
        if (!groupId) {
          return res.status(400).json({ message: 'groupId is required for non-superadmin users' });
        }
        const group = await Group.findById(groupId);
        if (!group || !group.isActive) {
          return res.status(400).json({ message: 'Invalid or inactive group' });
        }
        targetGroupId = group._id;
      }
    }

    const duplicate = await User.findOne({
      email: normalizedEmail,
      ...(targetGroupId ? { groupId: targetGroupId } : { role: 'superadmin' })
    });

    if (duplicate) {
      return res.status(409).json({ message: 'User already exists for this group' });
    }

    const createdUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone || '',
      passwordHash: password,
      role: targetRole,
      groupId: targetGroupId
    });

    const populatedUser = await User.findById(createdUser._id)
      .select('-passwordHash')
      .populate('groupId', 'name code location branding');

    res.status(201).json(serializeUser(populatedUser));
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const user = await User.findById(req.params.id)
      .select('-passwordHash')
      .populate('groupId', 'name code location branding');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isSelf = req.user._id.toString() === user._id.toString();
    if (!isSelf && !canManageUser(req, user)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(serializeUser(user));
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    if (!req.auth.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const target = await User.findById(req.params.id);
    if (!target) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!canManageUser(req, target)) {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }

    const { name, email, phone, role, password, groupId } = req.body;

    if (email && email.trim().toLowerCase() !== target.email) {
      const duplicate = await User.findOne({
        email: email.trim().toLowerCase(),
        groupId: target.groupId,
        _id: { $ne: target._id }
      });
      if (duplicate) {
        return res.status(409).json({ message: 'Email already in use for this group' });
      }
      target.email = email.trim().toLowerCase();
    }

    if (name) target.name = name;
    if (phone !== undefined) target.phone = phone;

    if (req.auth.isSuperAdmin && role && ['resident', 'admin', 'superadmin'].includes(role)) {
      target.role = role;
    } else if (!req.auth.isSuperAdmin && role && ['resident', 'admin'].includes(role)) {
      target.role = role;
    }

    if (req.auth.isSuperAdmin && groupId !== undefined && target.role !== 'superadmin') {
      const group = await Group.findById(groupId);
      if (!group || !group.isActive) {
        return res.status(400).json({ message: 'Invalid or inactive group' });
      }
      target.groupId = group._id;
    }

    if (password) {
      target.passwordHash = password;
    }

    await target.save();

    const populated = await User.findById(target._id)
      .select('-passwordHash')
      .populate('groupId', 'name code location branding');

    res.json(serializeUser(populated));
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!req.auth.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const target = await User.findById(req.params.id);
    if (!target) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!canManageUser(req, target)) {
      return res.status(403).json({ message: 'Not authorized to delete this user' });
    }

    if (target._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

export default router;
