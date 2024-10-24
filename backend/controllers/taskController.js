import Task from '../models/Task.js';
import mongoose from 'mongoose';
import User from '../models/User.js';

// Get a task by ID
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task ID format' });
    }
    const task = await Task.findById(id).populate('assignedTo', 'name');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    console.error('Error fetching task by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { name, description, dueDate, points, assignedTo, icon } = req.body;
    console.log('Received task data:', req.body);

    const newTask = new Task({
      name,
      description,
      dueDate,
      points: Number(points),
      priority: 1, // Set default priority for new tasks
      assignedTo: assignedTo || "Unassigned", // Set to "Unassigned" if not provided
      icon,
      createdBy: req.user.id,
    });

    const savedTask = await newTask.save();
    const populatedTask = await Task.findById(savedTask._id).populate('assignedTo', 'name');
    console.log('Saved task:', populatedTask);

    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'name').sort({ priority: 1 });

    const formattedTasks = tasks.map(task => {
      const taskObj = task.toObject();
      if (!taskObj.assignedTo) {
        taskObj.assignedTo = { _id: "Unassigned", name: "Unassigned" };
      }
      return {
        ...taskObj,
        _id: taskObj._id.toString()
      };
    });

    console.log('Sending tasks:', JSON.stringify(formattedTasks, null, 2));
    res.status(200).json(formattedTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task ID format' });
    }

    const updatedData = { ...req.body };
    if (!updatedData.assignedTo) {
      updatedData.assignedTo = "Unassigned";
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updatedData, { new: true }).populate('assignedTo', 'name');

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task ID format' });
    }
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update task priorities
export const updateTaskPriorities = async (req, res) => {
  try {
    const { priorities } = req.body;

    console.log('Received priorities:', JSON.stringify(priorities, null, 2));

    if (!Array.isArray(priorities) || priorities.length === 0) {
      return res.status(400).json({ message: 'Invalid priorities data' });
    }

    const bulkOps = priorities.map(({ id, priority }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { priority } }
      }
    }));

    const result = await Task.bulkWrite(bulkOps);

    console.log('Bulk update result:', result);

    res.status(200).json({ message: 'Task priorities updated successfully', result });
  } catch (error) {
    console.error('Error updating task priorities:', error);
    res.status(500).json({ message: 'Server error while updating task priorities', error: error.message });
  }
};

// Add these new functions to the existing taskController.js file

export const completeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only complete your own tasks' });
    }
    task.status = 'pending_approval';
    task.completedAt = new Date();
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const assignTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    console.log('Assigning task:', id, 'to user:', userId);

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.assignedTo && task.assignedTo !== "Unassigned") {
      return res.status(400).json({ message: 'Task is already assigned' });
    }

    task.assignedTo = userId;
    await task.save();

    const updatedTask = await Task.findById(id).populate('assignedTo', 'name');
    res.json(updatedTask);
  } catch (error) {
    console.error('Error in assignTask:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const unassignTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    task.assignedTo = "Unassigned";
    task.isCompleted = false; // Set isCompleted to false
    task.status = 'active'; // Set status to active
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const approveTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Only admins can approve tasks' });
    }
    task.status = 'completed'; // Set status to completed
    task.isCompleted = true; // Set isCompleted to true
    task.approvedBy = req.user.id;
    task.approvedAt = new Date();
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCompletedTasks = async (req, res) => {
  try {
    const completedTasks = await Task.find({ isCompleted: true }); // Use isCompleted property
    res.status(200).json(completedTasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching completed tasks', error });
  }
};
