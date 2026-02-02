const mongoose = require('mongoose');

const foodCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: true,
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  order: {
    type: Number,
    default: 0,
    min: 0
  },
  image: {
    type: String,
    default: ''
  },
  isActive: {
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

// Index for faster queries
foodCategorySchema.index({ name: 1 });
foodCategorySchema.index({ order: 1 });
foodCategorySchema.index({ isActive: 1 });

// Virtual: Get food items count in this category
foodCategorySchema.virtual('foodItemsCount', {
  ref: 'FoodItem',
  localField: '_id',
  foreignField: 'category',
  count: true
});

// Pre-save middleware to update updatedAt
foodCategorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('FoodCategory', foodCategorySchema);