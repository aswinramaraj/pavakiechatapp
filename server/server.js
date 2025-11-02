const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    // Allow the client origin configured in env (useful for deployed frontend).
    // Fallback to allowing all origins so socket connections from dev don't get blocked.
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"]
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Store user's socket ID with their user ID for targeting
  socket.on('authenticate', (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      // Join a room named after their user ID
      socket.join(decoded.userId);
      console.log('User authenticated:', decoded.userId);
    } catch (error) {
      console.error('Socket authentication failed:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/friends', require('./routes/friendRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running successfully!',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;

// Tweak keepAlive and headersTimeout to reduce connection reset/timeouts on some hosts (Render recommends higher values)
// headersTimeout must be greater than keepAliveTimeout
server.keepAliveTimeout = 120000; // 120 seconds
server.headersTimeout = 125000; // slightly higher than keepAliveTimeout

// Bind explicitly to 0.0.0.0 on some hosting providers (like Render) to ensure the service is reachable
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Graceful logging for unhandled rejections and exceptions to aid debugging in production
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
  // In production you might choose to exit the process and rely on the host to restart it
});

module.exports = app;

