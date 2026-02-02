const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { 
  getDashboardStats,
  getBookingReports,
  getCustomerReports
} = require('../controllers/adminController');

// Apply admin authorization to all routes
router.use(protect);
router.use(authorize('admin'));

// Dashboard routes
router.get('/dashboard', getDashboardStats);

// Reports routes
router.get('/reports/bookings', getBookingReports);
router.get('/reports/customers', getCustomerReports);

module.exports = router;