// models/Task.js
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, maxlength: 240 },
  dueDate: { type: Date, required: true },
  completedAt: { type: Date },
  verifiedAt: { type: Date },
  isCompleted: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  points: { type: Number, required: true },
  priority: { type: Number, default: 1 },  // New field for priority
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
