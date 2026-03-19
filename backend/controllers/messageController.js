import Message from '../models/Message.js';
import User from '../models/User.js';

const getMessageScope = (req) => {
    if (req.auth?.isSuperAdmin) {
        return req.query.groupId ? { groupId: req.query.groupId } : {};
    }
    return { groupId: req.auth.groupId };
};

// Create new message (admin only)
export const createMessage = async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const { title, content, isActive } = req.body;

        // Get all users to initialize their statuses
        const userQuery = req.auth.isSuperAdmin && req.body.groupId
            ? { groupId: req.body.groupId }
            : { groupId: req.auth.groupId };
        const allUsers = await User.find(userQuery, '_id');
        const userStatuses = allUsers.map(user => ({
            user: user._id,
            isActive: true,
            viewedAt: null
        }));

        const message = new Message({
            title,
            content,
            isActive,
            createdBy: req.user._id,
            groupId: req.auth.isSuperAdmin && req.body.groupId ? req.body.groupId : req.auth.groupId,
            userStatuses
        });

        await message.save();
        res.status(201).json(message);
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all messages
export const getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find(getMessageScope(req))
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });

        // Format messages with user-specific active status
        const formattedMessages = messages.map(message => {
            const messageObj = message.toObject();
            
            // Find user status or create default if not found
            const userStatus = messageObj.userStatuses?.find(
                status => status.user?.toString() === req.user._id.toString()
            ) || {
                isActive: true,
                viewedAt: null
            };
            
            return {
                _id: messageObj._id,
                title: messageObj.title,
                content: messageObj.content,
                createdBy: messageObj.createdBy,
                createdAt: messageObj.createdAt,
                updatedAt: messageObj.updatedAt,
                isActive: messageObj.isActive,
                isReadByCurrentUser: userStatus.viewedAt !== null,
                viewedAt: userStatus.viewedAt
            };
        });

        res.json(formattedMessages);
    } catch (error) {
        console.error('Error in getAllMessages:', error);
        res.status(500).json({ 
            message: 'Error fetching messages', 
            error: error.message 
        });
    }
};

// Update message (admin only)
export const updateMessage = async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Admin access required' });
        }

        // Reset all users' active status when message is updated
        const existingMessage = await Message.findOne({ _id: req.params.id, ...getMessageScope(req) });
        if (!existingMessage) {
            return res.status(404).json({ message: 'Message not found' });
        }

        const allUsers = await User.find({ groupId: existingMessage.groupId }, '_id');
        const userStatuses = allUsers.map(user => ({
            user: user._id,
            isActive: true,
            viewedAt: null
        }));

        const message = await Message.findOneAndUpdate(
            { _id: req.params.id, ...getMessageScope(req) },
            {
                ...req.body,
                userStatuses
            },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.json(message);
    } catch (error) {
        console.error('Error updating message:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete message (admin only)
export const deleteMessage = async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const message = await Message.findOneAndDelete({ _id: req.params.id, ...getMessageScope(req) });
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get active messages for current user
export const getActiveMessage = async (req, res) => {
    try {
        // Find messages that are globally active and either:
        // 1. Have no userStatuses entry for this user (new message)
        // 2. Have an active status for this user
        const messages = await Message.find({
            ...getMessageScope(req),
            isActive: true,
            $or: [
                { 'userStatuses.user': { $ne: req.user._id } },
                {
                    'userStatuses': {
                        $elemMatch: {
                            user: req.user._id,
                            isActive: true
                        }
                    }
                }
            ]
        })
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 });

        // Format messages for response
        const formattedMessages = messages.map(message => {
            const messageObj = message.toObject();
            const userStatus = messageObj.userStatuses.find(
                status => status.user.toString() === req.user._id.toString()
            );

            return {
                _id: messageObj._id,
                title: messageObj.title,
                content: messageObj.content,
                createdBy: messageObj.createdBy,
                createdAt: messageObj.createdAt,
                isActive: userStatus ? userStatus.isActive : true, // If no status exists, message is active
                isReadByCurrentUser: userStatus ? !!userStatus.viewedAt : false
            };
        });

        res.json(formattedMessages);
    } catch (error) {
        console.error('Error fetching active messages:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get most recent message
export const getRecentMessage = async (req, res) => {
    try {
        const message = await Message.findOne(getMessageScope(req))
            .sort({ createdAt: -1 })
            .populate('createdBy', 'name');
        res.json(message);
    } catch (error) {
        console.error('Error fetching recent message:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Check for unviewed messages
export const getUnviewedMessages = async (req, res) => {
    try {
        const hasUnviewed = await Message.exists({
            ...getMessageScope(req),
            isActive: true,
            $or: [
                // Message has no status for this user (new message)
                { 'userStatuses.user': { $ne: req.user._id } },
                // Message has active status and hasn't been viewed by this user
                {
                    'userStatuses': {
                        $elemMatch: {
                            user: req.user._id,
                            isActive: true,
                            viewedAt: null
                        }
                    }
                }
            ]
        });

        res.json({ hasUnviewed: !!hasUnviewed });
    } catch (error) {
        console.error('Error checking unviewed messages:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Mark message as viewed for current user
export const markMessagesAsViewed = async (req, res) => {
    try {
        const { messageId } = req.body;
        
        await Message.findOneAndUpdate(
            { 
                _id: messageId,
                ...getMessageScope(req),
                'userStatuses.user': req.user._id 
            },
            { 
                $set: { 
                    'userStatuses.$.isActive': false,
                    'userStatuses.$.viewedAt': new Date()
                }
            }
        );

        res.json({ message: 'Message marked as viewed' });
    } catch (error) {
        console.error('Error marking message as viewed:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
