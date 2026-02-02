const Review = require('../models/Review');
const Booking = require('../models/Booking');

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res) => {
  try {
    const { booking, ratings, comment, images } = req.body;

    // Check if booking exists
    const bookingDoc = await Booking.findById(booking);
    if (!bookingDoc) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    // Check if user owns the booking
    if (bookingDoc.customer.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to review this booking' 
      });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({ booking });
    if (existingReview) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already reviewed this booking' 
      });
    }

    // Calculate overall rating
    const overall = (ratings.food + ratings.service + ratings.ambiance + ratings.valueForMoney) / 4;

    // Create review
    const review = await Review.create({
      booking,
      customer: req.user.id,
      ratings,
      comment,
      images,
      overall,
      verified: true
    });

    // Mark booking as reviewed
    bookingDoc.reviewed = true;
    bookingDoc.reviewId = review._id;
    await bookingDoc.save();

    // Populate customer details
    await review.populate('customer', 'name');

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get reviews for facility/restaurant
// @route   GET /api/reviews/facility/:facilityId
// @access  Public
exports.getReviewsByFacility = async (req, res) => {
  try {
    const { facilityId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ facility: facilityId })
      .populate('customer', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({ facility: facilityId });

    res.status(200).json({
      success: true,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total,
       reviews
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ 
        success: false, 
        message: 'Review not found' 
      });
    }

    // Check if user owns the review
    if (review.customer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this review' 
      });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
       updatedReview
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ 
        success: false, 
        message: 'Review not found' 
      });
    }

    // Check if user owns the review or is admin
    if (review.customer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this review' 
      });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};