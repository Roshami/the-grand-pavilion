const Booking = require('../models/Booking');
const Facility = require('../models/Facility');
const EventPackage = require('../models/EventPackage');
const User = require('../models/User');
const generateBookingNumber = require('../utils/generateBookingNumber');
const generateQRCode = require('../utils/generateQRCode');
const calculatePrice = require('../utils/calculatePrice');
const sendEmail = require('../utils/sendEmail');

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const {
      type,
      facility,
      package: packageId,
      date,
      mealTime,
      timeSlot,
      guestCount,
      foodItems,
      selectedAddons,
      specialRequests,
      eventName,
      eventType,
      payment
    } = req.body;

    // Validate facility exists
    const facilityDoc = await Facility.findById(facility);
    if (!facilityDoc) {
      return res.status(404).json({ 
        success: false, 
        message: 'Facility not found' 
      });
    }

    // Check if facility is available
    const existingBooking = await Booking.findOne({
      facility,
      date: new Date(date),
      'timeSlot.start': { $lt: timeSlot.end },
      'timeSlot.end': { $gt: timeSlot.start },
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      return res.status(400).json({ 
        success: false, 
        message: 'Facility is not available for the selected time slot' 
      });
    }

    // Calculate pricing
    const pricing = await calculatePrice({
      type,
      facility: facilityDoc,
      packageId,
      guestCount,
      foodItems,
      selectedAddons
    });

    // Generate booking number and confirmation code
    const bookingNumber = await generateBookingNumber();
    const confirmationCode = `RES-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Generate QR code
    const qrCode = await generateQRCode(bookingNumber);

    // Set cancellation policy
    const cancellationPolicy = {
      type: type === 'package' || type === 'hall' ? 'event' : 'normal'
    };

    if (cancellationPolicy.type === 'event') {
      const deadline = new Date(date);
      deadline.setDate(deadline.getDate() - 2); // 2 days before event
      cancellationPolicy.deadline = deadline;
      cancellationPolicy.refundPercentage = 100;
    }

    // Create booking
    const booking = await Booking.create({
      bookingNumber,
      customer: req.user.id,
      customerDetails: {
        name: req.user.name,
        phone: req.user.phone,
        email: req.user.email
      },
      type,
      facility,
      facilityType: facilityDoc.type,
      facilityName: facilityDoc.name,
      package: packageId,
      packageName: packageId ? (await EventPackage.findById(packageId)).name : null,
      eventName,
      eventType,
      date: new Date(date),
      mealTime,
      timeSlot,
      guestCount,
      foodItems,
      selectedAddons,
      pricing,
      payment,
      specialRequests,
      confirmationCode,
      qrCode,
      cancellationPolicy,
      status: payment?.status === 'paid' ? 'confirmed' : 'pending'
    });

    // Send confirmation email
    try {
      await sendEmail({
        email: req.user.email,
        subject: 'Booking Confirmation - The Grand Pavilion',
        message: `Your booking has been confirmed!\n\nBooking Number: ${bookingNumber}\nConfirmation Code: ${confirmationCode}\n\nPlease save this information for your records.`
      });
    } catch (error) {
      console.error('Email sending failed:', error);
    }

    // Populate facility details
    await booking.populate('facility', 'name capacity type');

    res.status(201).json({
      success: true,
       booking
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get my bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user.id })
      .populate('facility', 'name capacity type')
      .populate('package', 'name eventType')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
       bookings
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('facility', 'name capacity type features')
      .populate('package', 'name eventType basePrice pricePerPerson');

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    // Check if user owns this booking or is admin/staff
    if (booking.customer.toString() !== req.user.id && req.user.role === 'customer') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to view this booking' 
      });
    }

    res.status(200).json({
      success: true,
       booking
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    // Check if user owns this booking
    if (booking.customer.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to cancel this booking' 
      });
    }

    // Check if already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({ 
        success: false, 
        message: 'Booking is already cancelled' 
      });
    }

    // Check cancellation policy
    const now = new Date();
    if (booking.cancellationPolicy.type === 'event') {
      if (now > booking.cancellationPolicy.deadline) {
        return res.status(400).json({ 
          success: false, 
          message: 'Cannot cancel event booking within 2 days of the event' 
        });
      }
    }

    // Update status
    booking.status = 'cancelled';
    booking.cancelledAt = now;
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
       booking
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Update booking status (Admin/Staff only)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin/Staff
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, staffNotes } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    // Update status
    booking.status = status;
    if (staffNotes) {
      booking.staffNotes = staffNotes;
    }

    // If confirming, mark as confirmed
    if (status === 'confirmed') {
      booking.bookingConfirmed = true;
      booking.confirmedAt = new Date();
    }

    await booking.save();

    res.status(200).json({
      success: true,
       booking
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get all bookings (Admin/Staff only)
// @route   GET /api/bookings
// @access  Private/Admin/Staff
exports.getAllBookings = async (req, res) => {
  try {
    const { status, date, type } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (date) {
      query.date = new Date(date);
    }

    if (type) {
      query.type = type;
    }

    const bookings = await Booking.find(query)
      .populate('customer', 'name email phone')
      .populate('facility', 'name capacity type')
      .populate('package', 'name eventType')
      .sort({ date: 1, 'timeSlot.start': 1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get daily bookings (Admin/Staff only)
// @route   GET /api/bookings/daily/:date
// @access  Private/Admin/Staff
exports.getDailyBookings = async (req, res) => {
  try {
    const { date } = req.params;

    const bookings = await Booking.find({ 
      date: new Date(date),
      status: { $in: ['pending', 'confirmed'] }
    })
      .populate('facility', 'name capacity type')
      .populate('package', 'name')
      .sort({ 'timeSlot.start': 1 });

    // Group by time slot
    const groupedBookings = bookings.reduce((acc, booking) => {
      const timeKey = booking.timeSlot.start;
      if (!acc[timeKey]) {
        acc[timeKey] = [];
      }
      acc[timeKey].push(booking);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      date,
      totalBookings: bookings.length,
      groupedBookings
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Generate invoice
// @route   GET /api/bookings/:id/invoice
// @access  Private
exports.generateInvoice = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('facility', 'name')
      .populate('package', 'name');

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    // Check authorization
    if (booking.customer.toString() !== req.user.id && req.user.role === 'customer') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to view this invoice' 
      });
    }

    const invoice = {
      invoiceNumber: `INV-${booking.bookingNumber}`,
      bookingNumber: booking.bookingNumber,
      date: booking.date,
      customer: booking.customerDetails,
      facility: booking.facilityName,
      packageName: booking.packageName,
      timeSlot: booking.timeSlot,
      guestCount: booking.guestCount,
      items: [
        {
          description: booking.facilityName,
          quantity: 1,
          price: booking.pricing.facilityCharge
        },
        ...booking.foodItems.map(item => ({
          description: item.name,
          quantity: item.quantity,
          price: item.price * item.quantity
        })),
        ...booking.selectedAddons.map(addon => ({
          description: addon.addon,
          quantity: 1,
          price: addon.price
        }))
      ],
      subtotal: booking.pricing.facilityCharge + booking.pricing.foodTotal + booking.pricing.addonTotal,
      tax: booking.pricing.tax,
      discount: booking.pricing.discount,
      total: booking.pricing.total,
      paymentStatus: booking.payment.status
    };

    res.status(200).json({
      success: true,
       invoice
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};