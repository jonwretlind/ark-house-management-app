import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    match: [/^[a-z0-9-]+$/, 'Group code must contain only lowercase letters, numbers, and hyphens']
  },
  location: {
    type: String,
    trim: true,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  branding: {
    logoUrl: {
      type: String,
      trim: true,
      default: ''
    },
    loginBackgroundUrl: {
      type: String,
      trim: true,
      default: ''
    },
    appBackgroundUrl: {
      type: String,
      trim: true,
      default: ''
    },
    primaryColor: {
      type: String,
      trim: true,
      default: '#1a4731'
    },
    secondaryColor: {
      type: String,
      trim: true,
      default: '#d35400'
    },
    accentColor: {
      type: String,
      trim: true,
      default: '#2c3e50'
    },
    textColor: {
      type: String,
      trim: true,
      default: '#ecf0f1'
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Group = mongoose.model('Group', groupSchema);

export default Group;
