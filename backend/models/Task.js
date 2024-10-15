// models/Task.js
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  points: { type: Number, required: true },
  assignedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isCompleted: { type: Boolean, default: false },
  dueDate: { type: Date },
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
