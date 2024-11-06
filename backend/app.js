const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const healthRouter = require('./routes/health');
const testRouter = require('./routes/test');

const app = express();

// Allow multiple origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  'http://your-azure-domain.com', // Add your Azure frontend domain
  'https://your-azure-domain.com' // Add HTTPS version if using SSL
];

// CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// Basic middleware
app.use(express.json());
app.use(cookieParser());

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

// Add a basic route for testing
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    origin: req.headers.origin
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something broke!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;