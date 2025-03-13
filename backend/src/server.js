const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Initialize Express
const app = express();
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? 'https://yourproductiondomain.com'
      : 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/auth');
const shipperRoutes = require('./routes/shipper');
const truckerRoutes = require('./routes/trucker');
const loadRoutes = require('./routes/load');
const bidRoutes = require('./routes/bid');
const adminRoutes = require('./routes/admin');
const benefitRoutes = require('./routes/benefit');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/shippers', shipperRoutes);
app.use('/api/truckers', truckerRoutes);
app.use('/api/loads', loadRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/benefits', benefitRoutes);

// Socket.io connection for real-time tracking
io.on('connection', (socket) => {
  console.log('A user connected', socket.id);
  
  // Join a tracking room for a specific load
  socket.on('joinTrackingRoom', (loadId) => {
    socket.join(`load_${loadId}`);
    console.log(`Socket ${socket.id} joined room: load_${loadId}`);
  });
  
  // Update load location
  socket.on('updateLocation', (data) => {
    io.to(`load_${data.loadId}`).emit('locationUpdate', {
      loadId: data.loadId,
      location: data.location,
      timestamp: new Date()
    });
  });
  
  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
  });
});

// Default route
app.get('/', (req, res) => {
  res.send('Load Posting System API');
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
}); 