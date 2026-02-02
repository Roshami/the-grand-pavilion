const Facility = require('../models/Facility');
const Booking = require('../models/Booking');

// @desc    Get all facilities
// @route   GET /api/facilities
// @access  Public
exports.getFacilities = async (req, res) => {
  try {
    const { type, capacity, available } = req.query;

    let query = {};

    if (type) {
      query.type = type;
    }

    if (capacity) {
      query.capacity = { $gte: parseInt(capacity) };
    }

    if (available === 'true') {
      query.isAvailable = true;
      query.isMaintenance = false;
    }

    const facilities = await Facility.find(query).sort({ type: 1, capacity: 1 });

    res.status(200).json({
      success: true,
      count: facilities.length,
      data: facilities
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get facility by ID
// @route   GET /api/facilities/:id
// @access  Public
exports.getFacilityById = async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);

    if (!facility) {
      return res.status(404).json({ 
        success: false, 
        message: 'Facility not found' 
      });
    }

    res.status(200).json({
      success: true,
       facility
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Check facility availability
// @route   GET /api/facilities/availability
// @access  Public
exports.checkAvailability = async (req, res) => {
  try {
    const { date, startTime, endTime, type, capacity } = req.query;

    if (!date || !startTime || !endTime) {
      return res.status(400).json({ 
        success: false, 
        message: 'Date, start time, and end time are required' 
      });
    }

    // Parse date
    const bookingDate = new Date(date);
    bookingDate.setUTCHours(0, 0, 0, 0);

    // Find all facilities matching criteria
    let facilityQuery = { isAvailable: true, isMaintenance: false };

    if (type) {
      facilityQuery.type = type;
    }

    if (capacity) {
      facilityQuery.capacity = { $gte: parseInt(capacity) };
    }

    const allFacilities = await Facility.find(facilityQuery);

    // Check availability for each facility
    const availableFacilities = [];

    for (const facility of allFacilities) {
      // Check if facility is booked during this time
      const existingBooking = await Booking.findOne({
        facility: facility._id,
        date: bookingDate,
        'timeSlot.start': { $lt: endTime },
        'timeSlot.end': { $gt: startTime },
        status: { $in: ['pending', 'confirmed'] }
      });

      if (!existingBooking) {
        availableFacilities.push({
          ...facility.toObject(),
          isAvailable: true
        });
      }
    }

    res.status(200).json({
      success: true,
      count: availableFacilities.length,
       availableFacilities
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Create facility
// @route   POST /api/facilities
// @access  Private/Admin/Staff
exports.createFacility = async (req, res) => {
  try {
    const facility = await Facility.create(req.body);

    res.status(201).json({
      success: true,
       facility
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Update facility
// @route   PUT /api/facilities/:id
// @access  Private/Admin/Staff
exports.updateFacility = async (req, res) => {
  try {
    const facility = await Facility.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!facility) {
      return res.status(404).json({ 
        success: false, 
        message: 'Facility not found' 
      });
    }

    res.status(200).json({
      success: true,
       facility
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Delete facility
// @route   DELETE /api/facilities/:id
// @access  Private/Admin
exports.deleteFacility = async (req, res) => {
  try {
    const facility = await Facility.findByIdAndDelete(req.params.id);

    if (!facility) {
      return res.status(404).json({ 
        success: false, 
        message: 'Facility not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Facility deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};