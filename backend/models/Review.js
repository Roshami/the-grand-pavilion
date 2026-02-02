const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Booking reference is required']
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer reference is required']
  },
  
  // Ratings (1-5 scale)
  ratings: {
    food: {
      type: Number,
      required: [true, 'Food rating is required'],
      min: 1,
      max: 5,
      default: 5
    },
    service: {
      type: Number,
      required: [true, 'Service rating is required'],
      min: 1,
      max: 5,
      default: 5
    },
    ambiance: {
      type: Number,
      required: [true, 'Ambiance rating is required'],
      min: 1,
      max: 5,
      default: 5
    },
    valueForMoney: {
      type: Number,
      required: [true, 'Value for money rating is required'],
      min: 1,
      max: 5,
      default: 5
    },
    overall: {
      type: Number,
      required: [true, 'Overall rating is required'],
      min: 1,
      max: 5
    }
  },
  
  comment: {
    type: String,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  
  images: [{
    type: String,
    maxlength: [500, 'Image URL cannot exceed 500 characters']
  }],
  
  likes: {
    type: Number,
    default: 0,
    min: 0
  },
  
  verified: {
    type: Boolean,
    default: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
reviewSchema.index({ booking: 1, customer: 1 }, { unique: true });
reviewSchema.index({ overall: -1 });
reviewSchema.index({ createdAt: -1 });

// Pre-save middleware to calculate overall rating if not provided
reviewSchema.pre('save', function(next) {
  if (this.isNew && !this.ratings.overall) {
    const { food, service, ambiance, valueForMoney } = this.ratings;
    this.ratings.overall = Math.round((food + service + ambiance + valueForMoney) / 4);
  }
  this.updatedAt = Date.now();
  next();
});

// Static method: Get average ratings for a facility
reviewSchema.statics.getFacilityRatings = async function(facilityId) {
  const stats = await this.aggregate([
    {
      $lookup: {
        from: 'bookings',
        localField: 'booking',
        foreignField: '_id',
        as: 'bookingDetails'
      }
    },
    {
      $unwind: '$bookingDetails'
    },
    {
      $match: {
        'bookingDetails.facility': new mongoose.Types.ObjectId(facilityId)
      }
    },
    {
      $group: {
        _id: null,
        averageFood: { $avg: '$ratings.food' },
        averageService: { $avg: '$ratings.service' },
        averageAmbiance: { $avg: '$ratings.ambiance' },
        averageValue: { $avg: '$ratings.valueForMoney' },
        averageOverall: { $avg: '$ratings.overall' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);
  
  return stats[0] || {
    averageFood: 0,
    averageService: 0,
    averageAmbiance: 0,
    averageValue: 0,
    averageOverall: 0,
    totalReviews: 0
  };
};

module.exports = mongoose.model('Review', reviewSchema);