import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import Event from '../models/Event.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);

// Get all events
router.get('/', async (req, res) => {
    try {
        console.log('Fetching events for user:', req.user._id);
        const events = await Event.find()
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });

        // Check if user has any unviewed events
        const hasNewEvents = events.some(event => 
            !event.viewedBy.includes(req.user._id)
        );

        res.json({
            events,
            hasNewEvents
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Error fetching events' });
    }
});

// Get user's events
router.get('/my-events', async (req, res) => {
    try {
        console.log('Fetching my events for user:', req.user._id);
        const events = await Event.find({
            $or: [
                { createdBy: req.user._id },
                { attendees: req.user._id }
            ]
        }).populate('createdBy', 'name');
        res.json(events);
    } catch (error) {
        console.error('Error fetching user events:', error);
        res.status(500).json({ message: 'Error fetching user events' });
    }
});

// Mark events as viewed
router.post('/mark-viewed', async (req, res) => {
    try {
        console.log('Marking events as viewed for user:', req.user._id);
        const userId = req.user._id;

        // Update all events to add the user to viewedBy if not already there
        const result = await Event.updateMany(
            { viewedBy: { $ne: userId } },
            { $addToSet: { viewedBy: userId } }
        );

        console.log('Mark viewed result:', result);
        res.json({ message: 'Events marked as viewed', modifiedCount: result.modifiedCount });
    } catch (error) {
        console.error('Error marking events as viewed:', error);
        res.status(500).json({ message: 'Error marking events as viewed' });
    }
});

// Create new event
router.post('/', async (req, res) => {
    try {
        const newEvent = new Event({
            ...req.body,
            createdBy: req.user._id,
            viewedBy: [req.user._id] // Creator has viewed it
        });
        const savedEvent = await newEvent.save();
        res.status(201).json(await savedEvent.populate('createdBy', 'name'));
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Error creating event' });
    }
});

// Update event
router.put('/:id', async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        ).populate('createdBy', 'name');
        res.json(updatedEvent);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Error updating event' });
    }
});

// Delete event
router.delete('/:id', async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Error deleting event' });
    }
});

export default router;
