const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { 
  getDashboardStats,
  getBookingReports,
  getCustomerReports,
  updateUserRole,
  getUsers
} = require('../controllers/adminController');

// Apply admin authorization to all routes
router.use(protect);
router.use(authorize('admin'));

// Dashboard routes
router.get('/dashboard', getDashboardStats);

// Reports routes
router.get('/reports/bookings', getBookingReports);
router.get('/reports/customers', getCustomerReports); // ✅ FIX: This was missing before

// Add this route after dashboard route
router.get('/users', getUsers); // ✅ ADD THIS NEW ROUTE

// User management routes
router.put('/users/:id/role', updateUserRole); // ✅ ADD THIS NEW ROUTE
module.exports = router;