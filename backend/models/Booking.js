const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerDetails: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: String
  },
  type: {
    type: String,
    enum: ['table', 'hall', 'package'],
    required: true
  },
  facility: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility',
    required: true
  },
  facilityType: {
    type: String,
    enum: ['table', 'hall', 'room']
  },
  facilityName: String,
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EventPackage'
  },
  packageName: String,
  eventName: String,
  eventType: {
    type: String,
    enum: ['wedding', 'birthday', 'corporate', 'anniversary', 'engagement', 'other']
  },
  date: {
    type: Date,
    required: true
  },
  mealTime: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'custom'],
    required: true
  },
  timeSlot: {
    start: { type: String, required: true },
    end: { type: String, required: true },
    duration: Number
  },
  guestCount: {
    type: Number,
    required: true,
    min: 1
  },
  adults: Number,
  children: Number,
  foodItems: [{
    foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' },
    name: String,
    quantity: { type: Number, required: true, min: 1 },
    price: Number,
    notes: String
  }],
  selectedAddons: [{
    addon: String,
    price: Number,
    description: String
  }],
  pricing: {
    facilityCharge: { type: Number, default: 0 },
    foodTotal: { type: Number, default: 0 },
    addonTotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    advancePaid: { type: Number, default: 0 },
    balanceDue: { type: Number, default: 0 }
  },
  payment: {
    status: {
      type: String,
      enum: ['unpaid', 'partial', 'paid', 'refunded'],
      default: 'unpaid'
    },
    method: {
      type: String,
      enum: ['cash', 'card', 'online', 'bank_transfer']
    },
    transactionId: String,
    paidAt: Date
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'],
    default: 'pending'
  },
  cancellationPolicy: {
    type: {
      type: String,
      enum: ['normal', 'event'],
      default: 'normal'
    },
    deadline: Date,
    refundPercentage: { type: Number, default: 100 }
  },
  specialRequests: String,
  confirmationCode: String,
  qrCode: String,
  bookingConfirmed: {
    type: Boolean,
    default: false
  },
  confirmedAt: Date,
  remindersSent: {
    email: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    whatsapp: { type: Boolean, default: false },
    sentAt: Date
  },
  reviewed: {
    type: Boolean,
    default: false
  },
  reviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  },
  staffNotes: String,
  assignedStaff: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Generate unique booking number before save
bookingSchema.pre('save', async function(next) {
  if (this.isNew && !this.bookingNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Booking').countDocuments();
    this.bookingNumber = `BK-${year}-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);