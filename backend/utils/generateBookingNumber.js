const Booking = require('../models/Booking');

const generateBookingNumber = async () => {
  try {
    // Get current year
    const year = new Date().getFullYear();
    
    // Get count of bookings for this year
    const count = await Booking.countDocuments({
      createdAt: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`)
      }
    });
    
    // Generate booking number: BK-2026-000001
    const bookingNumber = `BK-${year}-${String(count + 1).padStart(6, '0')}`;
    
    return bookingNumber;
  } catch (error) {
    console.error('Error generating booking number:', error);
    throw error;
  }
};

module.exports = generateBookingNumber;