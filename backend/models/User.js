// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  }, 
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  phone: {
    type: String,  // For SMS notifications
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,  // Default is non-admin user (resident)
  },
  accountBalance: {
    type: Number,
    default: 0,  // User's accumulated points
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastEventView: {
    type: Date,
    default: null
  },
  avatarUrl: {
    type: String,
    default: null,
    get: (url) => url || null  // Simple getter that just returns the URL as stored
  },
  birthday: {
    type: Date,
    required: false
  },
  lastMessageView: {
    type: Date,
    default: null
  }
}, {
  toJSON: { getters: true },  // Enable getters when converting to JSON
  toObject: { getters: true }  // Enable getters when converting to object
});

// Password hashing pre-save hook
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

// Add a static method to create a test admin user
userSchema.statics.createTestUser = async function() {
  try {
    // Check if test user already exists
    const existingUser = await this.findOne({ email: 'admin@example.com' });
    if (existingUser) {
      console.log('Test user already exists');
      return existingUser;
    }

    // Create new test user
    const testUser = new this({
      name: 'Admin User',
      email: 'admin@example.com',
      phone: '1234567890',
      passwordHash: 'admin123', // This will be hashed by the pre-save middleware
      isAdmin: true
    });

    await testUser.save();
    console.log('Test user created successfully');
    return testUser;
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  }
};

const User = mongoose.model('User', userSchema);

export default User;
