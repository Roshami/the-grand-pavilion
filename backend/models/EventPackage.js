const mongoose = require('mongoose');

const eventPackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Package name is required'],
    trim: true,
    maxlength: [100, 'Package name cannot exceed 100 characters']
  },
  eventType: {
    type: String,
    enum: ['wedding', 'birthday', 'corporate', 'anniversary', 'engagement', 'other'],
    required: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  tagline: {
    type: String,
    maxlength: [100, 'Tagline cannot exceed 100 characters']
  },
  
  // Pricing
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: 0
  },
  pricePerPerson: {
    type: Number,
    required: [true, 'Price per person is required'],
    min: 0
  },
  minGuests: {
    type: Number,
    required: [true, 'Minimum guests is required'],
    min: 1
  },
  maxGuests: {
    type: Number,
    required: [true, 'Maximum guests is required'],
    min: 1
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: 1,
    description: 'Duration in hours'
  },
  
  // What's Included
  inclusions: {
    venue: {
      facility: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facility',
        required: true
      },
      hours: {
        type: Number,
        required: true,
        min: 1
      }
    },
    tables: {
      type: Number,
      default: 0,
      min: 0
    },
    chairs: {
      type: Number,
      default: 0,
      min: 0
    },
    basicDecoration: {
      type: Boolean,
      default: false
    },
    stageSetup: {
      type: Boolean,
      default: false
    },
    soundSystem: {
      type: Boolean,
      default: false
    },
    lighting: {
      type: Boolean,
      default: false
    },
    catering: {
      included: {
        type: Boolean,
        default: true
      },
      courses: {
        type: Number,
        default: 3,
        min: 1
      },
      menuType: {
        type: String,
        enum: ['buffet', 'plated', 'cocktail'],
        default: 'buffet'
      }
    },
    staff: {
      waiters: {
        type: Number,
        default: 0,
        min: 0
      },
      chefs: {
        type: Number,
        default: 0,
        min: 0
      },
      security: {
        type: Number,
        default: 0,
        min: 0
      }
    },
    parking: {
      type: Boolean,
      default: false
    },
    valetService: {
      type: Boolean,
      default: false
    }
  },
  
  // Food Menu Options
  menuOptions: {
    starters: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodItem'
    }],
    mainCourse: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodItem'
    }],
    desserts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodItem'
    }],
    beverages: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodItem'
    }]
  },
  
  // Available Add-ons
  addons: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      maxlength: [200, 'Description cannot exceed 200 characters']
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      enum: ['decoration', 'entertainment', 'photography', 'technology', 'other'],
      default: 'other'
    }
  }],
  
  // Package Images
  images: [String],
  thumbnail: String,
  
  // Terms & Conditions
  terms: [String],
  
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
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

// Indexes for performance
eventPackageSchema.index({ eventType: 1 });
eventPackageSchema.index({ isActive: 1 });
eventPackageSchema.index({ isFeatured: 1 });
eventPackageSchema.index({ basePrice: 1 });

// Virtual: Total value (base + min guests)
eventPackageSchema.virtual('totalValue').get(function() {
  return this.basePrice + (this.pricePerPerson * this.minGuests);
});

// Pre-save middleware
eventPackageSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('EventPackage', eventPackageSchema);