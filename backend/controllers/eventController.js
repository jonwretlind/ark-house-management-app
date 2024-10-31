import Event from '../models/Event.js';
import User from '../models/User.js';

export const createEvent = async (req, res) => {
  try {
    const { name, location, date, time, description } = req.body;
    const newEvent = new Event({
      name,
      location,
      date,
      time,
      description,
      createdBy: req.user.id,
    });
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    const user = await User.findById(req.user.id);
    
    const hasNewEvents = user.lastEventView 
      ? events.some(event => event.createdAt > user.lastEventView)
      : events.length > 0;

    res.json({ events, hasNewEvents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markEventsAsViewed = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { lastEventView: new Date() });
    res.status(200).json({ message: 'Events marked as viewed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rsvpEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const userIndex = event.attendees.indexOf(req.user._id);
    let isAttending;

    if (userIndex === -1) {
      event.attendees.push(req.user._id);
      isAttending = true;
    } else {
      event.attendees.splice(userIndex, 1);
      isAttending = false;
    }

    await event.save();
    res.json({ isAttending });
  } catch (error) {
    console.error('Server error in rsvpEvent:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ attendees: req.user._id }).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching user\'s events:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
