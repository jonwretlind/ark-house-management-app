import Message from '../models/Message.js';

export const createMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const newMessage = new Message({
      content,
      createdBy: req.user.id,
    });
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).limit(5);
    
    // If there are more than 5 messages, delete the oldest one
    const count = await Message.countDocuments();
    if (count > 5) {
      const oldestMessage = await Message.findOne().sort({ createdAt: 1 });
      await Message.findByIdAndDelete(oldestMessage._id);
    }
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getActiveMessage = async (req, res) => {
  try {
    const activeMessage = await Message.findOne({ active: true }).sort({ createdAt: -1 });
    res.json(activeMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecentMessage = async (req, res) => {
  try {
    const recentMessage = await Message.findOne().sort({ createdAt: -1 });
    if (recentMessage) {
      recentMessage.viewed = true;
      await recentMessage.save();
    }
    res.json(recentMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markMessagesAsViewed = async (req, res) => {
  try {
    await Message.updateMany({ viewed: false }, { viewed: true });
    res.status(200).json({ message: 'All messages marked as viewed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkUnviewedMessages = async (req, res) => {
  try {
    const unviewedCount = await Message.countDocuments({ viewed: false });
    res.json({ hasUnviewed: unviewedCount > 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
