import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config();

function getArgValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1 || index === process.argv.length - 1) {
    return undefined;
  }

  return process.argv[index + 1];
}

function getAdminInput() {
  const name = getArgValue('--name') || process.env.ADMIN_NAME;
  const email = getArgValue('--email') || process.env.ADMIN_EMAIL;
  const password = getArgValue('--password') || process.env.ADMIN_PASSWORD;

  return { name, email, password };
}

function validateInput({ name, email, password }) {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required.');
  }

  if (!name || !email || !password) {
    throw new Error(
      'Missing admin credentials. Provide --name, --email, and --password, or set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD.'
    );
  }
}

async function seedAdmin() {
  const adminInput = getAdminInput();

  try {
    validateInput(adminInput);

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const normalizedEmail = adminInput.email.trim().toLowerCase();
    let user = await User.findOne({ email: normalizedEmail, role: 'superadmin' });

    if (!user) {
      user = new User({
        name: adminInput.name,
        email: normalizedEmail,
        passwordHash: adminInput.password,
        role: 'superadmin',
        groupId: null
      });

      await user.save();
      console.log(`Created admin user ${adminInput.email}`);
    } else {
      user.name = adminInput.name;
      user.email = normalizedEmail;
      user.passwordHash = adminInput.password;
      user.role = 'superadmin';
      user.groupId = null;

      await user.save();
      console.log(`Updated existing user ${adminInput.email} to superadmin`);
    }
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

seedAdmin();