// controllers/taskController.js
import Task from '../models/Task.js';
import User from '../models/User.js';

// Admin: Create a new task
export const createTask = async (req, res) => {
  const { name, description, dueDate, points } = req.body;

  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied: Admins only.' });
    }

    const newTask = new Task({
      name,
      description,
      dueDate,
      points,
      createdBy: req.user._id,  // Admin who created the task
    });

    await newTask.save();
    res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Update a task
export const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { name, description, dueDate, points } = req.body;

  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied: Admins only.' });
    }

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.name = name;
    task.description = description;
    task.dueDate = dueDate;
    task.points = points;

    await task.save();
    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Delete a task
export const deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied: Admins only.' });
    }

    const task = await Task.findByIdAndDelete(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Non-Admin: Sign-up and complete a task
export const completeTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.isCompleted) {
      return res.status(400).json({ message: 'Task has already been completed' });
    }

    task.isCompleted = true;
    task.completedAt = new Date();
    task.assignedTo = req.user._id;

    await task.save();

    // Notify admin (trigger email/SMS notification here)
    // For now, log the message to the console
    console.log(`Task "${task.name}" completed by ${req.user.name}`);

    res.status(200).json({ message: 'Task marked as completed', task });
  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Verify a task and award points
export const verifyTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied: Admins only.' });
    }

    const task = await Task.findById(taskId).populate('assignedTo');
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (!task.isCompleted) {
      return res.status(400).json({ message: 'Task is not completed yet' });
    }

    task.isVerified = true;
    task.verifiedAt = new Date();

    const user = task.assignedTo;
    if (user) {
      user.accountBalance += task.points;
      await user.save();
    }

    await task.save();
    res.status(200).json({ message: 'Task verified and points awarded', task });
  } catch (error) {
    console.error('Error verifying task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
