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
    const messages = await Message.find().sort({ createdAt: -1 }).limit(10);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
