import dotenv from 'dotenv'; // Load dotenv at the top!
dotenv.config(); // Ensure this runs first

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';  // Import cookie-parser
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js'; // Import the tasks route
import userRoutes from './routes/userRoutes.js'; // Import user routes


const app = express();
app.use(
  cors({
    origin: 'http://localhost:5173', // Allow Vite frontend
    credentials: true, // Enable cookies and credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);
app.use(express.json());
app.use(cookieParser());  // Enable cookie parsing

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes); // Register tasks routes
app.use('/api/users', userRoutes); // Use the user routes under the /api/users path



const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
