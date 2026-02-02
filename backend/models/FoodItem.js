const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Food name is required'],
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodCategory',
    required: true
  },
  description: String,
  pricing: {
    price: { type: Number, required: true, min: 0 },
    offerPrice: Number,
    isOnOffer: { type: Boolean, default: false }
  },
  type: {
    type: String,
    enum: ['veg', 'non_veg', 'vegan', 'egg'],
    required: true
  },
  spiceLevel: {
    type: String,
    enum: ['mild', 'medium', 'spicy', 'extra_spicy'],
    default: 'medium'
  },
  ingredients: [String],
  dietaryInfo: [String],
  isAvailable: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isRecommended: {
    type: Boolean,
    default: false
  },
  preparationTime: Number,
  images: [String],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  tags: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('FoodItem', foodItemSchema);