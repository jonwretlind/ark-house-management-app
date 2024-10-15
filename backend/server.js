// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';  // Import authentication routes
import { authenticateToken } from './middleware/authMiddleware.js';  // Import JWT authentication middleware

dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log('MongoDB connection error:', error));

// Auth routes
app.use('/api/auth', authRoutes);

// Example protected route
app.get('/api/protected', authenticateToken, (req, res) => {
  res.status(200).json({ message: `Welcome, ${req.user.email}!`, user: req.user });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
