// controllers/taskController.js
import Task from '../models/Task.js';
import User from '../models/User.js';

export const createTask = async (req, res) => {
  const { name, description, points, dueDate } = req.body;

  try {
    const task = new Task({ name, description, points, dueDate });
    await task.save();
    res.status(201).json({ message: 'Task created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error });
  }
};

export const completeTask = async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.isCompleted = true;
    task.assignedUserId = userId;
    await task.save();

    // Update user's points
    const user = await User.findById(userId);
    user.points += task.points;
    user.tasksCompleted.push(taskId);
    await user.save();

    res.status(200).json({ message: 'Task completed successfully and points added' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to complete task', error });
  }
};
