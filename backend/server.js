const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Load environment variables
dotenv.config();

// Import database connection
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const facilityRoutes = require('./routes/facilityRoutes');
const foodRoutes = require('./routes/foodRoutes');
const packageRoutes = require('./routes/packageRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Request logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
// Error handler (must be last middleware)
const { errorHandler } = require('./middleware/errorHandler');
app.use(errorHandler);

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);
//app.use('/api/reviews', reviewRoutes);
//app.use('/api/admin', adminRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Server is running', 
    timestamp: new Date().toISOString() 
  });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Welcome to The Grand Pavilion API',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`╔═══════════════════════════════════════════════╗`);
  console.log(`║                                               ║`);
  console.log(`║    🏛️  THE GRAND PAVILION API                  ║`);
  console.log(`║    🚀 Server running on port ${PORT}             ║`);
  console.log(`║    🌍 Environment: ${process.env.NODE_ENV || 'development'}                ║`);
  console.log(`║    📧 ${process.env.SMTP_FROM_EMAIL || 'Email not configured'}                ║`);
  console.log(`║                                               ║`);
  console.log(`╚═══════════════════════════════════════════════╝`);
  console.log(`\n📚 API Documentation: http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;