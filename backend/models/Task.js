// models/Task.js
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, maxlength: 240 },
  dueDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['active', 'pending_approval', 'completed'],
    default: 'active'
  },
  completedAt: { type: Date },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },
  isCompleted: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  points: { type: Number, required: true },
  priority: {
    type: Number,
    default: 1000, // Set a high default value
    min: 1 // Ensure priority is at least 1
  },
  assignedTo: { 
    type: mongoose.Schema.Types.Mixed,
    default: null,
    validate: {
      validator: function(v) {
        return v === null || v === "Unassigned" || mongoose.Types.ObjectId.isValid(v);
      },
      message: props => `${props.value} is not a valid assigned user!`
    }
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  icon: { type: String, required: false },
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
