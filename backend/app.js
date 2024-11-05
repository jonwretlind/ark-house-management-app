const express = require('express');
const healthRouter = require('./routes/health');
const testRouter = require('./routes/test');
const app = express();

// Basic middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration should be before routes
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Static files
app.use('/uploads', express.static('uploads'));

// API routes - all under /api prefix
app.use('/api/health', healthRouter);
app.use('/api/test', testRouter);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/messages', messageRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something broke!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;