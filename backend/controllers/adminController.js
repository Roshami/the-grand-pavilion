const Booking = require('../models/Booking');
const User = require('../models/User');
const Facility = require('../models/Facility');
const RestaurantInfo = require('../models/RestaurantInfo');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    // Total bookings
    const totalBookings = await Booking.countDocuments();
    
    // Confirmed bookings
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    
    // Pending bookings
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    
    // Cancelled bookings
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    
    // Total revenue (paid bookings)
    const revenue = await Booking.aggregate([
      { $match: { 'payment.status': 'paid' } },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } }
    ]);
    
    // Total customers
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    
    // Total facilities
    const totalFacilities = await Facility.countDocuments({ isAvailable: true });
    
    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('customer', 'name email')
      .populate('facility', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        bookings: {
          total: totalBookings,
          confirmed: confirmedBookings,
          pending: pendingBookings,
          cancelled: cancelledBookings
        },
        revenue: revenue[0]?.total || 0,
        customers: totalCustomers,
        facilities: totalFacilities,
        recentBookings
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get booking reports
// @route   GET /api/admin/reports/bookings
// @access  Private/Admin
exports.getBookingReports = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;

    let query = {};

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('customer', 'name email phone')
      .populate('facility', 'name capacity type')
      .sort({ date: -1 });

    // Calculate statistics
    const totalRevenue = bookings
      .filter(b => b.payment.status === 'paid')
      .reduce((sum, b) => sum + b.pricing.total, 0);

    const bookingsByType = bookings.reduce((acc, booking) => {
      acc[booking.type] = (acc[booking.type] || 0) + 1;
      return acc;
    }, {});

    const bookingsByStatus = bookings.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        period: { startDate, endDate },
        totalBookings: bookings.length,
        totalRevenue,
        bookingsByType,
        bookingsByStatus,
        bookings
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get customer reports
// @route   GET /api/admin/reports/customers
// @access  Private/Admin
exports.getCustomerReports = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('name email phone createdAt')
      .sort({ createdAt: -1 });

    // Get top customers by bookings
    const topCustomers = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { 
        _id: '$customer', 
        totalBookings: { $sum: 1 },
        totalSpent: { $sum: '$pricing.total' }
      }},
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'customerDetails'
        }
      },
      { $unwind: '$customerDetails' },
      { $project: { 
        _id: 0,
        customer: '$customerDetails.name',
        email: '$customerDetails.email',
        totalBookings: 1,
        totalSpent: 1
      }}
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCustomers: customers.length,
        topCustomers,
        customers
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};