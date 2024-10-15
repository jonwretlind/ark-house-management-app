// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'resident'], required: true },
  points: { type: Number, default: 0 },
  cryptoWalletAddress: { type: String, required: true },
  tasksCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
});

const User = mongoose.model('User', userSchema);

export default User;
