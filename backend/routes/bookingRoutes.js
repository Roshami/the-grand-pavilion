const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
  createBooking, 
  getMyBookings, 
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getAllBookings,
  getDailyBookings,
  generateInvoice 
} = require('../controllers/bookingController');

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/status', protect, updateBookingStatus);
router.put('/:id/cancel', protect, cancelBooking);
router.get('/', protect, getAllBookings); // Admin/Staff only
router.get('/daily/:date', protect, getDailyBookings);
router.get('/:id/invoice', protect, generateInvoice);

module.exports = router;