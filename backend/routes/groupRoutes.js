import express from 'express';
import Group from '../models/Group.js';
import User from '../models/User.js';
import { authenticateUser, requireSuperAdmin } from '../middleware/auth.js';

const router = express.Router();

const defaultBranding = {
  logoUrl: '',
  loginBackgroundUrl: '',
  appBackgroundUrl: '',
  primaryColor: '#1a4731',
  secondaryColor: '#d35400',
  accentColor: '#2c3e50',
  textColor: '#ecf0f1'
};

const normalizeBranding = (brandingInput = {}) => ({
  logoUrl: (brandingInput.logoUrl || '').trim(),
  loginBackgroundUrl: (brandingInput.loginBackgroundUrl || '').trim(),
  appBackgroundUrl: (brandingInput.appBackgroundUrl || '').trim(),
  primaryColor: (brandingInput.primaryColor || defaultBranding.primaryColor).trim(),
  secondaryColor: (brandingInput.secondaryColor || defaultBranding.secondaryColor).trim(),
  accentColor: (brandingInput.accentColor || defaultBranding.accentColor).trim(),
  textColor: (brandingInput.textColor || defaultBranding.textColor).trim()
});

router.use(authenticateUser);
router.use(requireSuperAdmin);

router.get('/', async (req, res) => {
  try {
    const groups = await Group.find().sort({ name: 1 });
    res.json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ message: 'Error fetching groups' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, code, location = '', isActive = true, branding } = req.body;

    if (!name || !code) {
      return res.status(400).json({ message: 'Name and code are required' });
    }

    const normalizedCode = code.trim().toLowerCase();
    const existing = await Group.findOne({ code: normalizedCode });
    if (existing) {
      return res.status(409).json({ message: 'Group code already exists' });
    }

    const group = await Group.create({
      name: name.trim(),
      code: normalizedCode,
      location: location.trim(),
      isActive,
      branding: normalizeBranding(branding),
      createdBy: req.user._id
    });

    res.status(201).json(group);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ message: 'Error creating group' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, code, location, isActive, branding } = req.body;
    const update = {};

    if (name !== undefined) update.name = name;
    if (location !== undefined) update.location = location;
    if (isActive !== undefined) update.isActive = isActive;
    if (branding !== undefined) update.branding = normalizeBranding(branding);

    if (code !== undefined) {
      const normalizedCode = code.trim().toLowerCase();
      const duplicate = await Group.findOne({ code: normalizedCode, _id: { $ne: req.params.id } });
      if (duplicate) {
        return res.status(409).json({ message: 'Group code already exists' });
      }
      update.code = normalizedCode;
    }

    const group = await Group.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json(group);
  } catch (error) {
    console.error('Error updating group:', error);
    res.status(500).json({ message: 'Error updating group' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const linkedUsers = await User.exists({ groupId: req.params.id });
    if (linkedUsers) {
      return res.status(400).json({ message: 'Cannot delete a group with assigned users' });
    }

    const deleted = await Group.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).json({ message: 'Error deleting group' });
  }
});

export default router;
