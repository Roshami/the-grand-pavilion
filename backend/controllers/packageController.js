const EventPackage = require('../models/EventPackage');

// @desc    Get all event packages
// @route   GET /api/packages
// @access  Public
exports.getPackages = async (req, res) => {
  try {
    const { eventType, active } = req.query;

    let query = {};

    if (eventType) {
      query.eventType = eventType;
    }

    if (active === 'true') {
      query.isActive = true;
    }

    const packages = await EventPackage.find(query)
      .populate('inclusions.venue.facility', 'name capacity')
      .sort({ basePrice: 1 });

    res.status(200).json({
      success: true,
      count: packages.length,
       packages
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get package by ID
// @route   GET /api/packages/:id
// @access  Public
exports.getPackageById = async (req, res) => {
  try {
    const eventPackage = await EventPackage.findById(req.params.id)
      .populate('inclusions.venue.facility', 'name capacity dimensions features');

    if (!eventPackage) {
      return res.status(404).json({ 
        success: false, 
        message: 'Package not found' 
      });
    }

    res.status(200).json({
      success: true,
       eventPackage
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Create event package
// @route   POST /api/packages
// @access  Private/Admin/Staff
exports.createPackage = async (req, res) => {
  try {
    const eventPackage = await EventPackage.create(req.body);

    res.status(201).json({
      success: true,
       eventPackage
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Update event package
// @route   PUT /api/packages/:id
// @access  Private/Admin/Staff
exports.updatePackage = async (req, res) => {
  try {
    const eventPackage = await EventPackage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!eventPackage) {
      return res.status(404).json({ 
        success: false, 
        message: 'Package not found' 
      });
    }

    res.status(200).json({
      success: true,
       eventPackage
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Delete event package
// @route   DELETE /api/packages/:id
// @access  Private/Admin
exports.deletePackage = async (req, res) => {
  try {
    const eventPackage = await EventPackage.findByIdAndDelete(req.params.id);

    if (!eventPackage) {
      return res.status(404).json({ 
        success: false, 
        message: 'Package not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Package deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};