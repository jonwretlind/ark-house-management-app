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

function getInput() {
  const email = getArgValue('--email') || process.env.SUPERADMIN_EMAIL;
  return {
    email: email ? email.trim().toLowerCase() : ''
  };
}

function validateInput({ email }) {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required.');
  }

  if (!email) {
    throw new Error('Missing email. Provide --email or set SUPERADMIN_EMAIL.');
  }
}

async function promoteSuperadmin() {
  const input = getInput();

  try {
    validateInput(input);

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({ email: input.email }).sort({ createdAt: 1 });

    if (!users.length) {
      throw new Error(`No user found with email ${input.email}`);
    }

    const targetUser = users.find((u) => u.role === 'admin') || users[0];

    if (targetUser.role === 'superadmin') {
      console.log(`User ${input.email} is already a superadmin`);
      return;
    }

    targetUser.role = 'superadmin';
    targetUser.groupId = null;
    await targetUser.save();

    console.log(
      `Promoted ${targetUser.email} (id: ${targetUser._id.toString()}) to superadmin`
    );

    if (users.length > 1) {
      console.log(
        `Note: ${users.length - 1} additional account(s) exist with this email in other groups.`
      );
    }
  } catch (error) {
    console.error('Error promoting user to superadmin:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

promoteSuperadmin();
