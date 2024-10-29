// models/Task.js
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'pending_approval', 'completed'],
    default: 'active'
  },
  priority: {
    type: Number,
    default: 1,
  },
  assignedTo: {
    type: mongoose.Schema.Types.Mixed,
    ref: 'User',
    default: "Unassigned"
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  completedAt: {
    type: Date,
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  approvedAt: {
    type: Date,
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
  }
}, {
  timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
